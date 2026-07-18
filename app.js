/*
 * Shape by Shape - app.js
 * Vanilla-JS state machine and interaction logic.
 * Classic script (not a module); attaches to window.SBS, loaded AFTER subjects.js.
 */
(function () {
  'use strict';

  window.SBS = window.SBS || {};

  var SNAPSHOT_SIZE = 640;
  var STROKE_WIDTH = 0.016;
  var NUDGE_VISIBLE_MS = 2200;

  /** @type {{screen:'picker'|'draw'|'reveal'|'compare', subjectId:string|null, currentStep:number, round:1|2, strokes:Array, player1Snapshot:string|null, player2Snapshot:string|null}} */
  var session = {
    screen: 'picker',
    subjectId: null,
    currentStep: 0,
    round: 1,
    strokes: [],
    player1Snapshot: null,
    player2Snapshot: null
  };

  // ---- DOM refs (cached in cacheDom) ----
  var elScreenPicker, elScreenDraw, elScreenReveal, elScreenCompare;
  var elSubjectButtons;
  var elReferenceCanvas, elPlayerCanvas;
  var elInstructionText, elStepProgress;
  var elBtnBack, elBtnNext, elBtnUndo, elBtnClear;
  var elNudgeToast;
  var elRevealPlayerCanvas, elRevealReferenceCanvas;
  var elBtnPass, elBtnRevealAgain;
  var elCompareImg1, elCompareImg2;
  var elBtnCompareAgain;

  var referenceCtx = null;
  var playerCtx = null;
  var revealPlayerCtx = null;
  var revealReferenceCtx = null;
  var offscreenCanvas = null;

  var isDrawing = false;
  var activeStroke = null;
  var nudgeTimer = null;
  var revealObserver = null;

  // ---------------------------------------------------------------------
  // DOM caching + wiring
  // ---------------------------------------------------------------------

  function cacheDom() {
    elScreenPicker = document.getElementById('screen-picker');
    elScreenDraw = document.getElementById('screen-draw');
    elScreenReveal = document.getElementById('screen-reveal');
    elScreenCompare = document.getElementById('screen-compare');

    elSubjectButtons = document.getElementById('subject-buttons');

    elReferenceCanvas = document.getElementById('reference-canvas');
    elPlayerCanvas = document.getElementById('player-canvas');

    elInstructionText = document.getElementById('instruction-text');
    elStepProgress = document.getElementById('step-progress');

    elBtnBack = document.getElementById('btn-back');
    elBtnNext = document.getElementById('btn-next');
    elBtnUndo = document.getElementById('btn-undo');
    elBtnClear = document.getElementById('btn-clear');

    elNudgeToast = document.getElementById('nudge-toast');

    elRevealPlayerCanvas = document.getElementById('reveal-player-canvas');
    elRevealReferenceCanvas = document.getElementById('reveal-reference-canvas');
    elBtnPass = document.getElementById('btn-pass');
    elBtnRevealAgain = document.getElementById('btn-reveal-again');

    elCompareImg1 = document.getElementById('compare-img-1');
    elCompareImg2 = document.getElementById('compare-img-2');
    elBtnCompareAgain = document.getElementById('btn-compare-again');

    if (elReferenceCanvas) referenceCtx = elReferenceCanvas.getContext('2d');
    if (elPlayerCanvas) playerCtx = elPlayerCanvas.getContext('2d');
    if (elRevealPlayerCanvas) revealPlayerCtx = elRevealPlayerCanvas.getContext('2d');
    if (elRevealReferenceCanvas) revealReferenceCtx = elRevealReferenceCanvas.getContext('2d');
  }

  function wireEvents() {
    if (elSubjectButtons) {
      elSubjectButtons.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('button[data-subject-id]') : null;
        if (btn) selectSubject(btn.getAttribute('data-subject-id'));
      });
    }

    if (elBtnBack) elBtnBack.addEventListener('click', prevStep);
    if (elBtnNext) elBtnNext.addEventListener('click', nextStep);
    if (elBtnUndo) elBtnUndo.addEventListener('click', undoStroke);
    if (elBtnClear) elBtnClear.addEventListener('click', clearCanvas);

    if (elBtnPass) elBtnPass.addEventListener('click', passToFriend);
    if (elBtnRevealAgain) elBtnRevealAgain.addEventListener('click', drawAnother);
    if (elBtnCompareAgain) elBtnCompareAgain.addEventListener('click', drawAnother);

    if (elPlayerCanvas) {
      elPlayerCanvas.addEventListener('pointerdown', onPointerDown);
      elPlayerCanvas.addEventListener('pointermove', onPointerMove);
      elPlayerCanvas.addEventListener('pointerup', onPointerUp);
      elPlayerCanvas.addEventListener('pointercancel', onPointerUp);
      elPlayerCanvas.addEventListener('pointerleave', onPointerUp);
    }

    window.addEventListener('resize', debounce(handleResize, 120));
    window.addEventListener('orientationchange', handleResize);
  }

  function debounce(fn, wait) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  // ---------------------------------------------------------------------
  // Init + render (the only place screens toggle)
  // ---------------------------------------------------------------------

  function init() {
    cacheDom();
    buildSubjectButtons();
    wireEvents();
    session.screen = 'picker';
    render();
  }

  function render() {
    var map = {
      picker: elScreenPicker,
      draw: elScreenDraw,
      reveal: elScreenReveal,
      compare: elScreenCompare
    };
    Object.keys(map).forEach(function (key) {
      var el = map[key];
      if (!el) return;
      if (key === session.screen) {
        el.classList.remove('screen--hidden');
      } else {
        el.classList.add('screen--hidden');
      }
    });

    if (session.screen === 'draw') {
      drawScreenDraw();
    } else if (session.screen === 'reveal') {
      drawScreenReveal();
    } else if (session.screen === 'compare') {
      drawScreenCompare();
    }

    setupRevealAnimation();
  }

  function handleResize() {
    if (session.screen === 'draw') {
      drawScreenDraw();
    } else if (session.screen === 'reveal') {
      drawScreenReveal();
    } else if (session.screen === 'picker') {
      repaintThumbs();
    }
  }

  // ---------------------------------------------------------------------
  // Picker screen
  // ---------------------------------------------------------------------

  function buildSubjectButtons() {
    if (!elSubjectButtons || !window.SBS.SUBJECTS) return;
    elSubjectButtons.innerHTML = '';
    Object.keys(window.SBS.SUBJECTS).forEach(function (id) {
      var subject = window.SBS.SUBJECTS[id];

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'subject-card';
      btn.setAttribute('data-subject-id', id);

      var thumb = document.createElement('span');
      thumb.className = 'subject-card__thumb';
      var canvas = document.createElement('canvas');
      thumb.appendChild(canvas);

      var label = document.createElement('span');
      label.className = 'subject-card__label';
      label.textContent = subject.label;

      btn.appendChild(thumb);
      btn.appendChild(label);
      elSubjectButtons.appendChild(btn);

      paintThumb(canvas, subject);
    });
  }

  function paintThumb(canvas, subject) {
    var dpr = window.devicePixelRatio || 1;
    var size = 96;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = Math.max(1, Math.round(size * dpr));
    canvas.height = Math.max(1, Math.round(size * dpr));
    var ctx = canvas.getContext('2d');
    ctx.setTransform(canvas.width, 0, 0, canvas.height, 0, 0);
    ctx.clearRect(0, 0, 1, 1);
    subject.steps.forEach(function (step) {
      step.draw(ctx);
    });
  }

  function repaintThumbs() {
    if (!elSubjectButtons || !window.SBS.SUBJECTS) return;
    var buttons = elSubjectButtons.querySelectorAll('button[data-subject-id]');
    buttons.forEach(function (btn) {
      var id = btn.getAttribute('data-subject-id');
      var subject = window.SBS.SUBJECTS[id];
      var canvas = btn.querySelector('.subject-card__thumb canvas');
      if (subject && canvas) paintThumb(canvas, subject);
    });
  }

  function selectSubject(id) {
    if (!window.SBS.SUBJECTS || !window.SBS.SUBJECTS[id]) return;
    session.subjectId = id;
    session.currentStep = 0;
    session.round = 1;
    session.strokes = [];
    session.screen = 'draw';
    render();
  }

  // ---------------------------------------------------------------------
  // Draw screen: canvas sizing + reference / player rendering
  // ---------------------------------------------------------------------

  function sizeCanvasToDisplay(canvas) {
    if (!canvas) return null;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var cssW = rect.width || canvas.clientWidth || 300;
    var cssH = rect.height || canvas.clientHeight || 300;
    var backingW = Math.max(1, Math.round(cssW * dpr));
    var backingH = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== backingW) canvas.width = backingW;
    if (canvas.height !== backingH) canvas.height = backingH;
    var ctx = canvas.getContext('2d');
    // Normalized 0..1 logical space -> full backing pixel size (bakes in dpr).
    ctx.setTransform(canvas.width, 0, 0, canvas.height, 0, 0);
    return ctx;
  }

  function currentSubject() {
    return session.subjectId ? window.SBS.SUBJECTS[session.subjectId] : null;
  }

  function renderReference(subject, stepIndex) {
    if (!subject || !elReferenceCanvas) return;
    var ctx = sizeCanvasToDisplay(elReferenceCanvas);
    referenceCtx = ctx;
    ctx.clearRect(0, 0, 1, 1);
    paintBackground(ctx);
    for (var i = 0; i <= stepIndex && i < subject.steps.length; i++) {
      subject.steps[i].draw(ctx);
    }
  }

  function paintBackground(ctx) {
    ctx.save();
    ctx.fillStyle = cssVar('--color-surface', '#fdfcf9');
    ctx.fillRect(0, 0, 1, 1);
    ctx.restore();
  }

  function cssVar(name, fallback) {
    try {
      var val = getComputedStyle(document.documentElement).getPropertyValue(name);
      val = (val || '').trim();
      return val || fallback;
    } catch (err) {
      return fallback;
    }
  }

  function redrawPlayer() {
    if (!elPlayerCanvas) return;
    var ctx = sizeCanvasToDisplay(elPlayerCanvas);
    playerCtx = ctx;
    ctx.clearRect(0, 0, 1, 1);
    paintBackground(ctx);
    paintStrokes(ctx, session.strokes);
  }

  function paintStrokes(ctx, strokes) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = cssVar('--color-fg', '#02060d');
    ctx.lineWidth = STROKE_WIDTH;
    strokes.forEach(function (stroke) {
      if (!stroke || stroke.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      if (stroke.length === 1) {
        ctx.lineTo(stroke[0].x + 0.0001, stroke[0].y + 0.0001);
      } else {
        for (var i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawScreenDraw() {
    var subject = currentSubject();
    if (!subject) return;
    renderReference(subject, session.currentStep);
    redrawPlayer();
    updateStepUI(subject);
  }

  function updateStepUI(subject) {
    var step = subject.steps[session.currentStep];
    if (elInstructionText) elInstructionText.textContent = step.instruction;
    if (elStepProgress) {
      elStepProgress.textContent = 'Step ' + (session.currentStep + 1) + ' of ' + subject.steps.length;
    }

    var atStart = session.currentStep === 0;
    if (elBtnBack) {
      elBtnBack.disabled = atStart;
      elBtnBack.classList.toggle('btn--disabled', atStart);
    }

    var atEnd = session.currentStep === subject.steps.length - 1;
    if (elBtnNext) {
      elBtnNext.textContent = atEnd ? (session.round === 2 ? 'Finish' : 'Reveal') : 'Next';
    }
  }

  // ---------------------------------------------------------------------
  // Pointer capture
  // ---------------------------------------------------------------------

  function pointToNormalized(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    var x = rect.width ? (e.clientX - rect.left) / rect.width : 0;
    var y = rect.height ? (e.clientY - rect.top) / rect.height : 0;
    x = Math.min(1, Math.max(0, x));
    y = Math.min(1, Math.max(0, y));
    return { x: x, y: y };
  }

  function onPointerDown(e) {
    if (!elPlayerCanvas) return;
    e.preventDefault();
    isDrawing = true;
    activeStroke = [];
    session.strokes.push(activeStroke);
    activeStroke.push(pointToNormalized(e, elPlayerCanvas));
    if (elPlayerCanvas.setPointerCapture) {
      try {
        elPlayerCanvas.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ignore capture failures (e.g. unsupported pointer type) */
      }
    }
    redrawPlayer();
  }

  function onPointerMove(e) {
    if (!isDrawing || !activeStroke || !elPlayerCanvas) return;
    e.preventDefault();
    activeStroke.push(pointToNormalized(e, elPlayerCanvas));
    redrawPlayer();
  }

  function onPointerUp(e) {
    if (!isDrawing) return;
    isDrawing = false;
    activeStroke = null;
    if (elPlayerCanvas && elPlayerCanvas.releasePointerCapture) {
      try {
        elPlayerCanvas.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* pointer capture may already be released */
      }
    }
    redrawPlayer();
  }

  function undoStroke() {
    session.strokes.pop();
    redrawPlayer();
  }

  function clearCanvas() {
    session.strokes = [];
    redrawPlayer();
  }

  // ---------------------------------------------------------------------
  // Step navigation
  // ---------------------------------------------------------------------

  function nextStep() {
    var subject = currentSubject();
    if (!subject) return;

    if (session.currentStep < subject.steps.length - 1) {
      session.currentStep++;
      renderReference(subject, session.currentStep);
      updateStepUI(subject);
      return;
    }

    if (!guardNonEmpty()) return;

    if (session.round === 2) {
      finishRound2();
    } else {
      goReveal();
    }
  }

  function prevStep() {
    if (session.currentStep === 0) return;
    var subject = currentSubject();
    if (!subject) return;
    session.currentStep--;
    renderReference(subject, session.currentStep);
    updateStepUI(subject);
  }

  function guardNonEmpty() {
    var hasInk = session.strokes.some(function (stroke) {
      return stroke && stroke.length > 0;
    });
    if (!hasInk) {
      showNudge();
      return false;
    }
    return true;
  }

  function showNudge() {
    if (!elNudgeToast) return;
    elNudgeToast.classList.add('nudge--visible');
    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(function () {
      elNudgeToast.classList.remove('nudge--visible');
    }, NUDGE_VISIBLE_MS);
  }

  // ---------------------------------------------------------------------
  // Snapshot capture (single path for reveal + compare)
  // ---------------------------------------------------------------------

  function getOffscreenCanvas() {
    if (!offscreenCanvas) {
      offscreenCanvas = document.createElement('canvas');
    }
    return offscreenCanvas;
  }

  function snapshotStrokes(strokes) {
    var canvas = getOffscreenCanvas();
    var dpr = window.devicePixelRatio || 1;
    var backing = Math.max(1, Math.round(SNAPSHOT_SIZE * dpr));
    canvas.width = backing;
    canvas.height = backing;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(canvas.width, 0, 0, canvas.height, 0, 0);
    ctx.clearRect(0, 0, 1, 1);
    paintBackground(ctx);
    paintStrokes(ctx, strokes);
    return canvas.toDataURL('image/png');
  }

  function drawSnapshotToCanvas(ctx, dataUrl) {
    if (!ctx) return;
    ctx.clearRect(0, 0, 1, 1);
    paintBackground(ctx);
    if (!dataUrl) return;
    var img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, 1, 1);
      paintBackground(ctx);
      ctx.drawImage(img, 0, 0, 1, 1);
    };
    img.src = dataUrl;
  }

  // ---------------------------------------------------------------------
  // Reveal / pass / compare / restart transitions
  // ---------------------------------------------------------------------

  function goReveal() {
    session.player1Snapshot = snapshotStrokes(session.strokes);
    session.screen = 'reveal';
    render();
  }

  function drawScreenReveal() {
    var subject = currentSubject();
    if (!subject) return;

    var refCtx = sizeCanvasToDisplay(elRevealReferenceCanvas);
    revealReferenceCtx = refCtx;
    if (refCtx) {
      refCtx.clearRect(0, 0, 1, 1);
      paintBackground(refCtx);
      subject.steps.forEach(function (step) {
        step.draw(refCtx);
      });
    }

    var playerHalfCtx = sizeCanvasToDisplay(elRevealPlayerCanvas);
    revealPlayerCtx = playerHalfCtx;
    drawSnapshotToCanvas(playerHalfCtx, session.player1Snapshot);
  }

  function passToFriend() {
    if (!session.player1Snapshot) {
      session.player1Snapshot = snapshotStrokes(session.strokes);
    }
    session.strokes = [];
    session.round = 2;
    session.currentStep = 0;
    session.screen = 'draw';
    render();
  }

  function finishRound2() {
    if (!guardNonEmpty()) return;
    session.player2Snapshot = snapshotStrokes(session.strokes);
    session.screen = 'compare';
    render();
  }

  function drawScreenCompare() {
    if (elCompareImg1) elCompareImg1.src = session.player1Snapshot || '';
    if (elCompareImg2) elCompareImg2.src = session.player2Snapshot || '';
  }

  function drawAnother() {
    session.screen = 'picker';
    session.subjectId = null;
    session.currentStep = 0;
    session.round = 1;
    session.strokes = [];
    session.player1Snapshot = null;
    session.player2Snapshot = null;
    render();
  }

  // ---------------------------------------------------------------------
  // Gentle entrance reveal (progressive enhancement only)
  // ---------------------------------------------------------------------

  function setupRevealAnimation() {
    if (!('IntersectionObserver' in window)) return;
    var prefersMotion = false;
    try {
      prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    } catch (err) {
      prefersMotion = false;
    }
    if (!prefersMotion) return;

    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    var targets = document.querySelectorAll('.reveal-anim:not(.is-visible)');
    targets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---------------------------------------------------------------------
  // Export + boot
  // ---------------------------------------------------------------------

  window.SBS.init = init;
  window.SBS.selectSubject = selectSubject;
  window.SBS.renderReference = renderReference;
  window.SBS.redrawPlayer = redrawPlayer;
  window.SBS.undoStroke = undoStroke;
  window.SBS.clearCanvas = clearCanvas;
  window.SBS.nextStep = nextStep;
  window.SBS.prevStep = prevStep;
  window.SBS.guardNonEmpty = guardNonEmpty;
  window.SBS.snapshotStrokes = snapshotStrokes;
  window.SBS.goReveal = goReveal;
  window.SBS.passToFriend = passToFriend;
  window.SBS.finishRound2 = finishRound2;
  window.SBS.drawAnother = drawAnother;
  window.SBS.render = render;

  window.addEventListener('load', function () {
    window.SBS.init();
  });
})();

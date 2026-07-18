// subjects.js
// Bundled sample content for Shape by Shape: two hard-coded cartoon subjects
// (dog, cat), each broken into ~5 additive drawing steps. Every step's
// draw(ctx) paints ONLY that step's incremental shapes, using Canvas 2D path
// calls authored entirely in a normalized 0..1 unit square. The caller
// (app.js) is responsible for applying the 0..1 -> pixel transform before
// calling draw(ctx); this file never touches canvas sizing or DOM.
(function () {
  "use strict";

  window.SBS = window.SBS || {};

  // Shared line/fill palette used across every step's shapes. Kept local to
  // this module (not exported) so subjects.js has zero surface beyond
  // SBS.SUBJECTS.
  var INK = "#2b2118";
  var FUR_DOG = "#e8c391";
  var FUR_DOG_DARK = "#caa06a";
  var FUR_CAT = "#e8e2d6";
  var FUR_CAT_DARK = "#b7ab94";
  var NOSE = "#3a2c22";
  var BLUSH = "#e8557f";
  var LINE_W = 0.012;

  function strokeOutline(ctx) {
    ctx.lineWidth = LINE_W;
    ctx.strokeStyle = INK;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  function ellipsePath(ctx, cx, cy, rx, ry, rotation) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rotation || 0, 0, Math.PI * 2);
  }

  function circlePath(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }

  // ---------------------------------------------------------------------
  // Dog
  // ---------------------------------------------------------------------

  var dogSteps = [
    {
      instruction: "Start with one big circle in the middle. That's the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.46, 0.27);
        ctx.fillStyle = FUR_DOG;
        ctx.fill();
        ctx.stroke();
      }
    },
    {
      instruction: "Add two floppy ears, one hanging down on each side of the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.fillStyle = FUR_DOG_DARK;

        // left ear
        ctx.save();
        ctx.translate(0.255, 0.4);
        ctx.rotate(-0.35);
        ellipsePath(ctx, 0, 0, 0.09, 0.19, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // right ear
        ctx.save();
        ctx.translate(0.745, 0.4);
        ctx.rotate(0.35);
        ellipsePath(ctx, 0, 0, 0.09, 0.19, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    },
    {
      instruction: "Draw an oval snout near the bottom of the head, with a small circle nose at its tip.",
      draw: function (ctx) {
        strokeOutline(ctx);

        // muzzle
        ellipsePath(ctx, 0.5, 0.58, 0.13, 0.09, 0);
        ctx.fillStyle = "#f6e6c8";
        ctx.fill();
        ctx.stroke();

        // nose
        circlePath(ctx, 0.5, 0.53, 0.028);
        ctx.fillStyle = NOSE;
        ctx.fill();
        ctx.stroke();
      }
    },
    {
      instruction: "Add two round eyes above the snout.",
      draw: function (ctx) {
        strokeOutline(ctx);

        circlePath(ctx, 0.41, 0.42, 0.032);
        ctx.fillStyle = INK;
        ctx.fill();

        circlePath(ctx, 0.59, 0.42, 0.032);
        ctx.fillStyle = INK;
        ctx.fill();

        // little eye shines
        ctx.fillStyle = "#ffffff";
        circlePath(ctx, 0.418, 0.412, 0.009);
        ctx.fill();
        circlePath(ctx, 0.598, 0.412, 0.009);
        ctx.fill();
      }
    },
    {
      instruction: "Finish with a curved smiling mouth and two rosy cheek dots.",
      draw: function (ctx) {
        strokeOutline(ctx);

        // mouth
        ctx.beginPath();
        ctx.moveTo(0.5, 0.555);
        ctx.quadraticCurveTo(0.46, 0.62, 0.41, 0.6);
        ctx.moveTo(0.5, 0.555);
        ctx.quadraticCurveTo(0.54, 0.62, 0.59, 0.6);
        ctx.stroke();

        // blush
        ctx.fillStyle = BLUSH;
        ctx.globalAlpha = 0.45;
        ellipsePath(ctx, 0.34, 0.5, 0.028, 0.018, 0);
        ctx.fill();
        ellipsePath(ctx, 0.66, 0.5, 0.028, 0.018, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  ];

  // ---------------------------------------------------------------------
  // Cat
  // ---------------------------------------------------------------------

  var catSteps = [
    {
      instruction: "Start with one big circle in the middle. That's the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.48, 0.26);
        ctx.fillStyle = FUR_CAT;
        ctx.fill();
        ctx.stroke();
      }
    },
    {
      instruction: "Add two pointy triangle ears on top of the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.fillStyle = FUR_CAT_DARK;

        // left ear
        ctx.beginPath();
        ctx.moveTo(0.3, 0.32);
        ctx.lineTo(0.34, 0.14);
        ctx.lineTo(0.44, 0.29);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // right ear
        ctx.beginPath();
        ctx.moveTo(0.7, 0.32);
        ctx.lineTo(0.66, 0.14);
        ctx.lineTo(0.56, 0.29);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a small triangle nose and two curved whisker cheeks below it.",
      draw: function (ctx) {
        strokeOutline(ctx);

        // nose
        ctx.beginPath();
        ctx.moveTo(0.487, 0.52);
        ctx.lineTo(0.513, 0.52);
        ctx.lineTo(0.5, 0.542);
        ctx.closePath();
        ctx.fillStyle = BLUSH;
        ctx.fill();
        ctx.stroke();

        // whiskers, left
        ctx.beginPath();
        ctx.moveTo(0.42, 0.55);
        ctx.lineTo(0.2, 0.52);
        ctx.moveTo(0.42, 0.57);
        ctx.lineTo(0.2, 0.58);
        ctx.stroke();

        // whiskers, right
        ctx.beginPath();
        ctx.moveTo(0.58, 0.55);
        ctx.lineTo(0.8, 0.52);
        ctx.moveTo(0.58, 0.57);
        ctx.lineTo(0.8, 0.58);
        ctx.stroke();
      }
    },
    {
      instruction: "Add two almond-shaped eyes above the nose.",
      draw: function (ctx) {
        strokeOutline(ctx);

        ellipsePath(ctx, 0.4, 0.44, 0.036, 0.045, 0);
        ctx.fillStyle = INK;
        ctx.fill();

        ellipsePath(ctx, 0.6, 0.44, 0.036, 0.045, 0);
        ctx.fillStyle = INK;
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        circlePath(ctx, 0.408, 0.428, 0.01);
        ctx.fill();
        circlePath(ctx, 0.608, 0.428, 0.01);
        ctx.fill();
      }
    },
    {
      instruction: "Finish with a small smiling mouth and two rosy cheek dots.",
      draw: function (ctx) {
        strokeOutline(ctx);

        // mouth
        ctx.beginPath();
        ctx.moveTo(0.5, 0.542);
        ctx.quadraticCurveTo(0.47, 0.58, 0.44, 0.565);
        ctx.moveTo(0.5, 0.542);
        ctx.quadraticCurveTo(0.53, 0.58, 0.56, 0.565);
        ctx.stroke();

        // blush
        ctx.fillStyle = BLUSH;
        ctx.globalAlpha = 0.4;
        ellipsePath(ctx, 0.33, 0.51, 0.026, 0.017, 0);
        ctx.fill();
        ellipsePath(ctx, 0.67, 0.51, 0.026, 0.017, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  ];

  window.SBS.SUBJECTS = {
    dog: {
      id: "dog",
      label: "Dog",
      steps: dogSteps
    },
    cat: {
      id: "cat",
      label: "Cat",
      steps: catSteps
    }
  };
})();

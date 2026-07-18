// subjects.js
// Bundled content for Shape by Shape: nine hard-coded subjects across three
// length categories (short 5-10 steps, medium 10-20, long 20-30). Every
// step's draw(ctx) paints ONLY that step's incremental shapes, using Canvas
// 2D path calls authored entirely in a normalized 0..1 unit square. The
// caller (app.js) applies the 0..1 -> pixel transform before calling
// draw(ctx); this file never touches canvas sizing or DOM.
(function () {
  "use strict";

  window.SBS = window.SBS || {};

  // Shared palette, local to this module.
  var INK = "#2b2118";
  var FUR_DOG = "#e8c391";
  var FUR_DOG_DARK = "#caa06a";
  var FUR_CAT = "#e8e2d6";
  var FUR_CAT_DARK = "#b7ab94";
  var NOSE = "#3a2c22";
  var BLUSH = "#e8557f";
  var PINK_SOFT = "#f2b8cb";
  var ORANGE = "#f08c3c";
  var ORANGE_DARK = "#d5702a";
  var RED = "#e05d5d";
  var RED_DARK = "#b54a4a";
  var YELLOW = "#f0c93c";
  var SKY = "#8ec9f0";
  var BLUE = "#4f96f0";
  var GREEN = "#58c08b";
  var CREAM = "#f6ecd8";
  var BROWN = "#a9764f";
  var BROWN_DARK = "#6b4a33";
  var STONE = "#d3dae1";
  var GRAY = "#cdd6de";
  var GRAY_LIGHT = "#e9edf1";
  var GRAY_DARK = "#7d8894";
  var WHITE = "#ffffff";
  var LINE_W = 0.012;

  // ---- tiny drawing helpers ----

  function strokeOutline(ctx) {
    ctx.lineWidth = LINE_W;
    ctx.strokeStyle = INK;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  function fillStroke(ctx, color) {
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }

  function ellipsePath(ctx, cx, cy, rx, ry, rotation) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rotation || 0, 0, Math.PI * 2);
  }

  function circlePath(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }

  function rectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (!r) {
      ctx.rect(x, y, w, h);
      return;
    }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function polyPath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  }

  function linePath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  }

  function drawSun(ctx, cx, cy, r) {
    circlePath(ctx, cx, cy, r);
    fillStroke(ctx, YELLOW);
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var a = (Math.PI * 2 * i) / 8;
      ctx.moveTo(cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r * 1.35);
      ctx.lineTo(cx + Math.cos(a) * r * 1.75, cy + Math.sin(a) * r * 1.75);
    }
    ctx.stroke();
  }

  function drawCloud(ctx, cx, cy, s) {
    circlePath(ctx, cx - s, cy, s * 0.75);
    fillStroke(ctx, WHITE);
    circlePath(ctx, cx + s, cy, s * 0.75);
    fillStroke(ctx, WHITE);
    circlePath(ctx, cx, cy - s * 0.4, s);
    fillStroke(ctx, WHITE);
  }

  function drawBird(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx - 2 * s, cy);
    ctx.quadraticCurveTo(cx - s, cy - 1.6 * s, cx, cy);
    ctx.quadraticCurveTo(cx + s, cy - 1.6 * s, cx + 2 * s, cy);
    ctx.stroke();
  }

  function drawFlower(ctx, cx, cy, s, petal) {
    linePath(ctx, [[cx, cy], [cx, cy + s * 2.2]]);
    ctx.strokeStyle = GREEN;
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.fillStyle = petal;
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      circlePath(ctx, cx + Math.cos(a) * s * 0.8, cy + Math.sin(a) * s * 0.8, s * 0.45);
      ctx.fill();
    }
    circlePath(ctx, cx, cy, s * 0.4);
    fillStroke(ctx, YELLOW);
  }

  // ---------------------------------------------------------------------
  // SHORT: Dog (7 steps)
  // ---------------------------------------------------------------------

  var dogSteps = [
    {
      instruction: "Start with one big circle in the middle. That's the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.46, 0.27);
        fillStroke(ctx, FUR_DOG);
      }
    },
    {
      instruction: "Add two floppy ears, one hanging down on each side of the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.save();
        ctx.translate(0.255, 0.4);
        ctx.rotate(-0.35);
        ellipsePath(ctx, 0, 0, 0.09, 0.19, 0);
        fillStroke(ctx, FUR_DOG_DARK);
        ctx.restore();
        ctx.save();
        ctx.translate(0.745, 0.4);
        ctx.rotate(0.35);
        ellipsePath(ctx, 0, 0, 0.09, 0.19, 0);
        fillStroke(ctx, FUR_DOG_DARK);
        ctx.restore();
      }
    },
    {
      instruction: "Draw an oval snout near the bottom of the head, with a small circle nose at its tip.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ellipsePath(ctx, 0.5, 0.58, 0.13, 0.09, 0);
        fillStroke(ctx, "#f6e6c8");
        circlePath(ctx, 0.5, 0.53, 0.028);
        fillStroke(ctx, NOSE);
      }
    },
    {
      instruction: "Add two round eyes above the snout, each with a tiny white shine.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.41, 0.42, 0.032);
        ctx.fillStyle = INK;
        ctx.fill();
        circlePath(ctx, 0.59, 0.42, 0.032);
        ctx.fillStyle = INK;
        ctx.fill();
        ctx.fillStyle = WHITE;
        circlePath(ctx, 0.418, 0.412, 0.009);
        ctx.fill();
        circlePath(ctx, 0.598, 0.412, 0.009);
        ctx.fill();
      }
    },
    {
      instruction: "Give the dog a curved smiling mouth and two rosy cheek dots.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.5, 0.555);
        ctx.quadraticCurveTo(0.46, 0.62, 0.41, 0.6);
        ctx.moveTo(0.5, 0.555);
        ctx.quadraticCurveTo(0.54, 0.62, 0.59, 0.6);
        ctx.stroke();
        ctx.fillStyle = BLUSH;
        ctx.globalAlpha = 0.45;
        ellipsePath(ctx, 0.34, 0.5, 0.028, 0.018, 0);
        ctx.fill();
        ellipsePath(ctx, 0.66, 0.5, 0.028, 0.018, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    {
      instruction: "Add a collar band under the chin, with a little round tag hanging from it.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.36, 0.705, 0.28, 0.05, 0.02);
        fillStroke(ctx, RED);
        circlePath(ctx, 0.5, 0.782, 0.022);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Finish with a happy tongue sticking out below the mouth.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ellipsePath(ctx, 0.5, 0.645, 0.03, 0.042, 0);
        fillStroke(ctx, PINK_SOFT);
        linePath(ctx, [[0.5, 0.615], [0.5, 0.668]]);
        ctx.stroke();
      }
    }
  ];

  // ---------------------------------------------------------------------
  // SHORT: Cat (7 steps)
  // ---------------------------------------------------------------------

  var catSteps = [
    {
      instruction: "Start with one big circle in the middle. That's the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.48, 0.26);
        fillStroke(ctx, FUR_CAT);
      }
    },
    {
      instruction: "Add two pointy triangle ears on top of the head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.3, 0.32], [0.34, 0.14], [0.44, 0.29]]);
        fillStroke(ctx, FUR_CAT_DARK);
        polyPath(ctx, [[0.7, 0.32], [0.66, 0.14], [0.56, 0.29]]);
        fillStroke(ctx, FUR_CAT_DARK);
      }
    },
    {
      instruction: "Draw a smaller pink triangle inside each ear.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.335, 0.29], [0.355, 0.19], [0.415, 0.275]]);
        fillStroke(ctx, PINK_SOFT);
        polyPath(ctx, [[0.665, 0.29], [0.645, 0.19], [0.585, 0.275]]);
        fillStroke(ctx, PINK_SOFT);
      }
    },
    {
      instruction: "Draw a small triangle nose and long whiskers on both cheeks.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.487, 0.52], [0.513, 0.52], [0.5, 0.542]]);
        fillStroke(ctx, BLUSH);
        ctx.beginPath();
        ctx.moveTo(0.42, 0.55);
        ctx.lineTo(0.2, 0.52);
        ctx.moveTo(0.42, 0.57);
        ctx.lineTo(0.2, 0.58);
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
        ctx.fillStyle = WHITE;
        circlePath(ctx, 0.408, 0.428, 0.01);
        ctx.fill();
        circlePath(ctx, 0.608, 0.428, 0.01);
        ctx.fill();
      }
    },
    {
      instruction: "Give the cat a small smiling mouth and two rosy cheek dots.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.5, 0.542);
        ctx.quadraticCurveTo(0.47, 0.58, 0.44, 0.565);
        ctx.moveTo(0.5, 0.542);
        ctx.quadraticCurveTo(0.53, 0.58, 0.56, 0.565);
        ctx.stroke();
        ctx.fillStyle = BLUSH;
        ctx.globalAlpha = 0.4;
        ellipsePath(ctx, 0.33, 0.51, 0.026, 0.017, 0);
        ctx.fill();
        ellipsePath(ctx, 0.67, 0.51, 0.026, 0.017, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
    {
      instruction: "Finish with three little tabby stripes on the forehead.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.strokeStyle = FUR_CAT_DARK;
        ctx.lineWidth = 0.018;
        ctx.beginPath();
        ctx.moveTo(0.445, 0.245);
        ctx.lineTo(0.455, 0.31);
        ctx.moveTo(0.5, 0.23);
        ctx.lineTo(0.5, 0.3);
        ctx.moveTo(0.555, 0.245);
        ctx.lineTo(0.545, 0.31);
        ctx.stroke();
      }
    }
  ];

  // ---------------------------------------------------------------------
  // SHORT: Fish (7 steps)
  // ---------------------------------------------------------------------

  var fishSteps = [
    {
      instruction: "Draw one big sideways oval in the middle. That's the fish's body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ellipsePath(ctx, 0.44, 0.5, 0.24, 0.155, 0);
        fillStroke(ctx, ORANGE);
      }
    },
    {
      instruction: "Add a wide tail on the right, like a sideways letter V touching the body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.66, 0.5], [0.85, 0.36], [0.8, 0.5], [0.85, 0.64]]);
        fillStroke(ctx, ORANGE_DARK);
      }
    },
    {
      instruction: "Give the fish a little triangle fin on top and one underneath.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.4, 0.365], [0.48, 0.24], [0.54, 0.375]]);
        fillStroke(ctx, ORANGE_DARK);
        polyPath(ctx, [[0.42, 0.63], [0.47, 0.74], [0.54, 0.62]]);
        fillStroke(ctx, ORANGE_DARK);
      }
    },
    {
      instruction: "Draw a round eye near the front, with a big pupil and a tiny shine.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.33, 0.45, 0.045);
        fillStroke(ctx, WHITE);
        circlePath(ctx, 0.335, 0.455, 0.02);
        ctx.fillStyle = INK;
        ctx.fill();
        circlePath(ctx, 0.343, 0.447, 0.006);
        ctx.fillStyle = WHITE;
        ctx.fill();
      }
    },
    {
      instruction: "Add a little smiling mouth at the front and a curved gill line behind the eye.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.arc(0.235, 0.53, 0.035, Math.PI * 0.15, Math.PI * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.44, 0.4);
        ctx.quadraticCurveTo(0.49, 0.5, 0.44, 0.6);
        ctx.stroke();
      }
    },
    {
      instruction: "Paint two curved stripes across the middle of the body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.strokeStyle = ORANGE_DARK;
        ctx.lineWidth = 0.028;
        ctx.beginPath();
        ctx.moveTo(0.53, 0.365);
        ctx.quadraticCurveTo(0.575, 0.5, 0.53, 0.63);
        ctx.moveTo(0.6, 0.41);
        ctx.quadraticCurveTo(0.63, 0.5, 0.6, 0.59);
        ctx.stroke();
      }
    },
    {
      instruction: "Finish with three bubbles floating up above the fish.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.strokeStyle = BLUE;
        circlePath(ctx, 0.72, 0.26, 0.03);
        ctx.stroke();
        circlePath(ctx, 0.78, 0.18, 0.022);
        ctx.stroke();
        circlePath(ctx, 0.71, 0.12, 0.015);
        ctx.stroke();
      }
    }
  ];

  // ---------------------------------------------------------------------
  // MEDIUM: Rocket (12 steps)
  // ---------------------------------------------------------------------

  var rocketSteps = [
    {
      instruction: "Draw a tall rectangle in the middle with softly rounded corners. That's the rocket body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.42, 0.26, 0.16, 0.36, 0.03);
        fillStroke(ctx, GRAY_LIGHT);
      }
    },
    {
      instruction: "Put a pointy triangle nose cone on top of the body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.42, 0.28], [0.5, 0.1], [0.58, 0.28]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Draw a round window in the upper half of the body, with a ring around it.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.37, 0.075);
        fillStroke(ctx, GRAY);
        circlePath(ctx, 0.5, 0.37, 0.052);
        fillStroke(ctx, SKY);
        circlePath(ctx, 0.478, 0.35, 0.012);
        ctx.fillStyle = WHITE;
        ctx.fill();
      }
    },
    {
      instruction: "Add a triangle fin on the left side, pointing down and out.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.42, 0.52], [0.3, 0.68], [0.42, 0.64]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Add a matching triangle fin on the right side.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.58, 0.52], [0.7, 0.68], [0.58, 0.64]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Paint a stripe band across the body, just under the window.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.42, 0.475, 0.16, 0.045, 0);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Draw a little trapezoid engine nozzle poking out of the bottom.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.45, 0.62], [0.55, 0.62], [0.575, 0.68], [0.425, 0.68]]);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Add a big orange flame bursting out of the nozzle.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.44, 0.68);
        ctx.quadraticCurveTo(0.5, 0.92, 0.56, 0.68);
        ctx.closePath();
        fillStroke(ctx, ORANGE);
      }
    },
    {
      instruction: "Add a smaller yellow flame inside the orange one.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.47, 0.68);
        ctx.quadraticCurveTo(0.5, 0.83, 0.53, 0.68);
        ctx.closePath();
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Puff little smoke clouds on both sides of the flame.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.375, 0.72, 0.032);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.625, 0.72, 0.032);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.335, 0.785, 0.022);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.665, 0.785, 0.022);
        fillStroke(ctx, GRAY_LIGHT);
      }
    },
    {
      instruction: "Sprinkle four twinkling stars around the sky (draw little plus signs).",
      draw: function (ctx) {
        strokeOutline(ctx);
        var stars = [[0.18, 0.2], [0.82, 0.16], [0.14, 0.52], [0.86, 0.48]];
        ctx.beginPath();
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          ctx.moveTo(s[0] - 0.022, s[1]);
          ctx.lineTo(s[0] + 0.022, s[1]);
          ctx.moveTo(s[0], s[1] - 0.022);
          ctx.lineTo(s[0], s[1] + 0.022);
        }
        ctx.stroke();
      }
    },
    {
      instruction: "Finish with a little ringed planet floating in the top corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.8, 0.28, 0.05);
        fillStroke(ctx, GREEN);
        ellipsePath(ctx, 0.8, 0.285, 0.085, 0.02, -0.35);
        ctx.stroke();
      }
    }
  ];

  // ---------------------------------------------------------------------
  // MEDIUM: House (13 steps)
  // ---------------------------------------------------------------------

  var houseSteps = [
    {
      instruction: "Draw a big square in the middle. That's the front of the house.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.3, 0.46, 0.4, 0.29, 0);
        fillStroke(ctx, CREAM);
      }
    },
    {
      instruction: "Add a wide triangle roof on top, poking out past the walls.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.26, 0.46], [0.5, 0.25], [0.74, 0.46]]);
        fillStroke(ctx, "#c96f4a");
      }
    },
    {
      instruction: "Draw a tall door in the middle of the house.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.46, 0.61, 0.08, 0.14, 0.015);
        fillStroke(ctx, BROWN);
      }
    },
    {
      instruction: "Give the door a tiny round doorknob.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.525, 0.685, 0.009);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Add a square window on the left side of the door.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.335, 0.53, 0.09, 0.09, 0);
        fillStroke(ctx, SKY);
      }
    },
    {
      instruction: "Add a matching square window on the right side.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.575, 0.53, 0.09, 0.09, 0);
        fillStroke(ctx, SKY);
      }
    },
    {
      instruction: "Draw a plus-shaped cross of panes inside each window.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.38, 0.53);
        ctx.lineTo(0.38, 0.62);
        ctx.moveTo(0.335, 0.575);
        ctx.lineTo(0.425, 0.575);
        ctx.moveTo(0.62, 0.53);
        ctx.lineTo(0.62, 0.62);
        ctx.moveTo(0.575, 0.575);
        ctx.lineTo(0.665, 0.575);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a little chimney sticking up from the right side of the roof.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.6, 0.29, 0.06, 0.1, 0);
        fillStroke(ctx, BROWN);
      }
    },
    {
      instruction: "Puff three little smoke clouds rising from the chimney.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.645, 0.245, 0.022);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.675, 0.185, 0.028);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.715, 0.125, 0.034);
        fillStroke(ctx, GRAY_LIGHT);
      }
    },
    {
      instruction: "Draw a path from the door widening toward the bottom of the page.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.46, 0.75], [0.54, 0.75], [0.6, 0.88], [0.4, 0.88]]);
        fillStroke(ctx, STONE);
        ctx.beginPath();
        ctx.moveTo(0.475, 0.795);
        ctx.lineTo(0.525, 0.795);
        ctx.moveTo(0.46, 0.84);
        ctx.lineTo(0.54, 0.84);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a smiling sun with rays in the top left corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawSun(ctx, 0.15, 0.15, 0.055);
      }
    },
    {
      instruction: "Float a puffy cloud in the top right corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawCloud(ctx, 0.82, 0.16, 0.04);
      }
    },
    {
      instruction: "Finish with a flower on each side of the path.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawFlower(ctx, 0.3, 0.82, 0.026, BLUSH);
        drawFlower(ctx, 0.69, 0.83, 0.026, BLUE);
      }
    }
  ];

  // ---------------------------------------------------------------------
  // MEDIUM: Robot (12 steps)
  // ---------------------------------------------------------------------

  var robotSteps = [
    {
      instruction: "Draw a rounded square near the top. That's the robot's head.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.38, 0.18, 0.24, 0.2, 0.04);
        fillStroke(ctx, GRAY);
      }
    },
    {
      instruction: "Add a short antenna on top with a little ball on the end.",
      draw: function (ctx) {
        strokeOutline(ctx);
        linePath(ctx, [[0.5, 0.18], [0.5, 0.115]]);
        ctx.stroke();
        circlePath(ctx, 0.5, 0.095, 0.02);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Give the robot two big round eyes.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.445, 0.27, 0.032);
        fillStroke(ctx, WHITE);
        circlePath(ctx, 0.555, 0.27, 0.032);
        fillStroke(ctx, WHITE);
        circlePath(ctx, 0.445, 0.27, 0.014);
        ctx.fillStyle = BLUE;
        ctx.fill();
        circlePath(ctx, 0.555, 0.27, 0.014);
        ctx.fillStyle = BLUE;
        ctx.fill();
      }
    },
    {
      instruction: "Draw a wide rectangle mouth with three little teeth lines inside.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.44, 0.325, 0.12, 0.028, 0.01);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0.47, 0.325);
        ctx.lineTo(0.47, 0.353);
        ctx.moveTo(0.5, 0.325);
        ctx.lineTo(0.5, 0.353);
        ctx.moveTo(0.53, 0.325);
        ctx.lineTo(0.53, 0.353);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a small neck, then a bigger rounded rectangle body below it.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.47, 0.38, 0.06, 0.04, 0);
        fillStroke(ctx, GRAY_DARK);
        rectPath(ctx, 0.36, 0.42, 0.28, 0.28, 0.04);
        fillStroke(ctx, GRAY_LIGHT);
      }
    },
    {
      instruction: "Draw a screen panel on the chest with a wavy line across it.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.44, 0.47, 0.12, 0.1, 0.015);
        fillStroke(ctx, SKY);
        ctx.beginPath();
        ctx.moveTo(0.455, 0.525);
        ctx.quadraticCurveTo(0.48, 0.49, 0.5, 0.525);
        ctx.quadraticCurveTo(0.52, 0.555, 0.545, 0.52);
        ctx.stroke();
      }
    },
    {
      instruction: "Add three little buttons under the screen: red, yellow, green.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.44, 0.63, 0.016);
        fillStroke(ctx, RED);
        circlePath(ctx, 0.5, 0.63, 0.016);
        fillStroke(ctx, YELLOW);
        circlePath(ctx, 0.56, 0.63, 0.016);
        fillStroke(ctx, GREEN);
      }
    },
    {
      instruction: "Draw a bendy arm on the left, ending in a two-finger claw.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.03;
        linePath(ctx, [[0.36, 0.47], [0.28, 0.56], [0.3, 0.64]]);
        ctx.stroke();
        ctx.lineWidth = LINE_W;
        linePath(ctx, [[0.3, 0.64], [0.265, 0.685]]);
        ctx.stroke();
        linePath(ctx, [[0.3, 0.64], [0.335, 0.685]]);
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a matching bendy arm and claw on the right.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.03;
        linePath(ctx, [[0.64, 0.47], [0.72, 0.56], [0.7, 0.64]]);
        ctx.stroke();
        ctx.lineWidth = LINE_W;
        linePath(ctx, [[0.7, 0.64], [0.665, 0.685]]);
        ctx.stroke();
        linePath(ctx, [[0.7, 0.64], [0.735, 0.685]]);
        ctx.stroke();
      }
    },
    {
      instruction: "Give the robot two short rectangle legs under the body.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.425, 0.7, 0.05, 0.09, 0);
        fillStroke(ctx, GRAY_DARK);
        rectPath(ctx, 0.525, 0.7, 0.05, 0.09, 0);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Add wide rounded feet at the bottom of the legs.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.4, 0.79, 0.095, 0.038, 0.018);
        fillStroke(ctx, GRAY);
        rectPath(ctx, 0.505, 0.79, 0.095, 0.038, 0.018);
        fillStroke(ctx, GRAY);
      }
    },
    {
      instruction: "Finish with a bolt on each side of the head and two little spark stars.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.375, 0.28, 0.014);
        fillStroke(ctx, YELLOW);
        circlePath(ctx, 0.625, 0.28, 0.014);
        fillStroke(ctx, YELLOW);
        var sparks = [[0.29, 0.14], [0.71, 0.12]];
        ctx.beginPath();
        for (var i = 0; i < sparks.length; i++) {
          var s = sparks[i];
          ctx.moveTo(s[0] - 0.02, s[1]);
          ctx.lineTo(s[0] + 0.02, s[1]);
          ctx.moveTo(s[0], s[1] - 0.02);
          ctx.lineTo(s[0], s[1] + 0.02);
        }
        ctx.stroke();
      }
    }
  ];

  // ---------------------------------------------------------------------
  // LONG: Castle (22 steps)
  // ---------------------------------------------------------------------

  var castleSteps = [
    {
      instruction: "Draw a wide grassy hill across the bottom of the page.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ellipsePath(ctx, 0.5, 0.9, 0.46, 0.13, 0);
        fillStroke(ctx, GREEN);
      }
    },
    {
      instruction: "Draw a big rectangle wall in the middle, sitting on the hill.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.32, 0.48, 0.36, 0.3, 0);
        fillStroke(ctx, STONE);
      }
    },
    {
      instruction: "Add three little square teeth (battlements) along the top of the wall.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.33, 0.44, 0.06, 0.04, 0);
        fillStroke(ctx, STONE);
        rectPath(ctx, 0.47, 0.44, 0.06, 0.04, 0);
        fillStroke(ctx, STONE);
        rectPath(ctx, 0.61, 0.44, 0.06, 0.04, 0);
        fillStroke(ctx, STONE);
      }
    },
    {
      instruction: "Draw a tall tower on the left side of the wall.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.2, 0.38, 0.12, 0.4, 0);
        fillStroke(ctx, STONE);
      }
    },
    {
      instruction: "Draw a matching tall tower on the right side.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.68, 0.38, 0.12, 0.4, 0);
        fillStroke(ctx, STONE);
      }
    },
    {
      instruction: "Put a pointy cone roof on the left tower.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.18, 0.38], [0.26, 0.22], [0.34, 0.38]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Put a pointy cone roof on the right tower.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.66, 0.38], [0.74, 0.22], [0.82, 0.38]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Draw a smaller square keep rising behind the middle of the wall.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.42, 0.3, 0.16, 0.14, 0);
        fillStroke(ctx, STONE);
      }
    },
    {
      instruction: "Give the keep its own pointy roof.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.4, 0.3], [0.5, 0.16], [0.6, 0.3]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Draw a big arched gate at the bottom middle of the wall.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.44, 0.78);
        ctx.lineTo(0.44, 0.66);
        ctx.quadraticCurveTo(0.5, 0.6, 0.56, 0.66);
        ctx.lineTo(0.56, 0.78);
        ctx.closePath();
        fillStroke(ctx, BROWN_DARK);
      }
    },
    {
      instruction: "Add two vertical plank lines and a crossbar on the gate.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.48, 0.635);
        ctx.lineTo(0.48, 0.78);
        ctx.moveTo(0.52, 0.635);
        ctx.lineTo(0.52, 0.78);
        ctx.moveTo(0.44, 0.71);
        ctx.lineTo(0.56, 0.71);
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a drawbridge folding down from the gate toward you.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.44, 0.78], [0.56, 0.78], [0.6, 0.88], [0.4, 0.88]]);
        fillStroke(ctx, BROWN);
        ctx.beginPath();
        ctx.moveTo(0.475, 0.78);
        ctx.lineTo(0.45, 0.88);
        ctx.moveTo(0.525, 0.78);
        ctx.lineTo(0.55, 0.88);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a blue moat pool on each side of the drawbridge.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ellipsePath(ctx, 0.29, 0.865, 0.1, 0.032, 0);
        fillStroke(ctx, BLUE);
        ellipsePath(ctx, 0.71, 0.865, 0.1, 0.032, 0);
        fillStroke(ctx, BLUE);
      }
    },
    {
      instruction: "Draw a tall skinny window on each tower.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.245, 0.46, 0.03, 0.07, 0.014);
        fillStroke(ctx, BROWN_DARK);
        rectPath(ctx, 0.725, 0.46, 0.03, 0.07, 0.014);
        fillStroke(ctx, BROWN_DARK);
      }
    },
    {
      instruction: "Give the keep a little round window with a cross inside.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.5, 0.365, 0.027);
        fillStroke(ctx, BROWN_DARK);
        ctx.beginPath();
        ctx.moveTo(0.473, 0.365);
        ctx.lineTo(0.527, 0.365);
        ctx.moveTo(0.5, 0.338);
        ctx.lineTo(0.5, 0.392);
        ctx.stroke();
      }
    },
    {
      instruction: "Add two skinny windows on the main wall, left and right of the gate.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.375, 0.55, 0.03, 0.06, 0.014);
        fillStroke(ctx, BROWN_DARK);
        rectPath(ctx, 0.595, 0.55, 0.03, 0.06, 0.014);
        fillStroke(ctx, BROWN_DARK);
      }
    },
    {
      instruction: "Fly a little pink flag from each tower roof.",
      draw: function (ctx) {
        strokeOutline(ctx);
        linePath(ctx, [[0.26, 0.22], [0.26, 0.14]]);
        ctx.stroke();
        polyPath(ctx, [[0.26, 0.14], [0.33, 0.165], [0.26, 0.19]]);
        fillStroke(ctx, BLUSH);
        linePath(ctx, [[0.74, 0.22], [0.74, 0.14]]);
        ctx.stroke();
        polyPath(ctx, [[0.74, 0.14], [0.81, 0.165], [0.74, 0.19]]);
        fillStroke(ctx, BLUSH);
      }
    },
    {
      instruction: "Fly one big yellow flag from the very top of the keep.",
      draw: function (ctx) {
        strokeOutline(ctx);
        linePath(ctx, [[0.5, 0.16], [0.5, 0.07]]);
        ctx.stroke();
        polyPath(ctx, [[0.5, 0.07], [0.6, 0.1], [0.5, 0.13]]);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Add a sun with rays in the top left corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawSun(ctx, 0.12, 0.13, 0.05);
      }
    },
    {
      instruction: "Float a puffy cloud in the top right of the sky.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawCloud(ctx, 0.86, 0.12, 0.035);
      }
    },
    {
      instruction: "Draw two little birds flying between the flags.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawBird(ctx, 0.38, 0.11, 0.018);
        drawBird(ctx, 0.64, 0.08, 0.015);
      }
    },
    {
      instruction: "Finish with a round tree on the left and a bush on the right of the hill.",
      draw: function (ctx) {
        strokeOutline(ctx);
        linePath(ctx, [[0.1, 0.82], [0.1, 0.74]]);
        ctx.stroke();
        circlePath(ctx, 0.1, 0.7, 0.05);
        fillStroke(ctx, GREEN);
        circlePath(ctx, 0.9, 0.79, 0.042);
        fillStroke(ctx, GREEN);
      }
    }
  ];

  // ---------------------------------------------------------------------
  // LONG: Pirate Ship (22 steps)
  // ---------------------------------------------------------------------

  var shipSteps = [
    {
      instruction: "Draw a wide band of sea across the bottom of the page.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.05, 0.8, 0.9, 0.12, 0.02);
        fillStroke(ctx, BLUE);
      }
    },
    {
      instruction: "Draw the hull: a wide boat shape floating on the sea.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.18, 0.62], [0.82, 0.62], [0.74, 0.8], [0.26, 0.8]]);
        fillStroke(ctx, BROWN);
      }
    },
    {
      instruction: "Paint a stripe along the top edge of the hull.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.18, 0.62], [0.82, 0.62], [0.8, 0.665], [0.2, 0.665]]);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Add three round portholes along the side of the hull.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.35, 0.72, 0.02);
        fillStroke(ctx, SKY);
        circlePath(ctx, 0.5, 0.725, 0.02);
        fillStroke(ctx, SKY);
        circlePath(ctx, 0.65, 0.72, 0.02);
        fillStroke(ctx, SKY);
      }
    },
    {
      instruction: "Draw a tall main mast rising from the middle of the deck.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.018;
        linePath(ctx, [[0.5, 0.62], [0.5, 0.16]]);
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a shorter mast near the front of the ship.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.016;
        linePath(ctx, [[0.3, 0.62], [0.3, 0.3]]);
        ctx.stroke();
      }
    },
    {
      instruction: "Hang a big square sail from the main mast.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.37, 0.2], [0.63, 0.2], [0.6, 0.44], [0.4, 0.44]]);
        fillStroke(ctx, CREAM);
      }
    },
    {
      instruction: "Paint two red stripes across the big sail.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.strokeStyle = RED;
        ctx.lineWidth = 0.022;
        ctx.beginPath();
        ctx.moveTo(0.385, 0.28);
        ctx.lineTo(0.615, 0.28);
        ctx.moveTo(0.395, 0.36);
        ctx.lineTo(0.605, 0.36);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a triangle sail on the front mast.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.3, 0.32], [0.3, 0.56], [0.16, 0.56]]);
        fillStroke(ctx, CREAM);
      }
    },
    {
      instruction: "Put a little crow's-nest basket near the top of the main mast.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.455, 0.15, 0.09, 0.038, 0.012);
        fillStroke(ctx, BROWN);
      }
    },
    {
      instruction: "Fly the pirate flag from the very top: a dark flag with a skull.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.5, 0.075, 0.11, 0.06, 0);
        fillStroke(ctx, "#3b3630");
        circlePath(ctx, 0.545, 0.098, 0.013);
        ctx.fillStyle = WHITE;
        ctx.fill();
        ctx.strokeStyle = WHITE;
        ctx.beginPath();
        ctx.moveTo(0.53, 0.12);
        ctx.lineTo(0.56, 0.115);
        ctx.stroke();
      }
    },
    {
      instruction: "Add a bowsprit pole slanting up from the front, and a small red pennant on the front mast.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.015;
        linePath(ctx, [[0.8, 0.63], [0.94, 0.55]]);
        ctx.stroke();
        ctx.lineWidth = LINE_W;
        polyPath(ctx, [[0.3, 0.3], [0.38, 0.32], [0.3, 0.34]]);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Draw a raised captain's cabin at the back of the deck, with a round window.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.18, 0.555, 0.12, 0.065, 0.012);
        fillStroke(ctx, BROWN_DARK);
        circlePath(ctx, 0.24, 0.588, 0.014);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Hang a little anchor near the front of the hull.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.76, 0.675, 0.012);
        ctx.stroke();
        linePath(ctx, [[0.76, 0.687], [0.76, 0.755]]);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.76, 0.745, 0.028, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
      }
    },
    {
      instruction: "Draw two rigging ropes from the main mast top down to the deck.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.006;
        ctx.beginPath();
        ctx.moveTo(0.5, 0.17);
        ctx.lineTo(0.66, 0.62);
        ctx.moveTo(0.3, 0.31);
        ctx.lineTo(0.2, 0.6);
        ctx.stroke();
      }
    },
    {
      instruction: "Add three curling white wave lines on the sea.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.strokeStyle = WHITE;
        ctx.beginPath();
        ctx.arc(0.15, 0.83, 0.03, Math.PI, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.48, 0.86, 0.03, Math.PI, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0.85, 0.84, 0.03, Math.PI, Math.PI * 1.85);
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a little fish leaping out of the water beside the ship.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.arc(0.12, 0.775, 0.04, Math.PI, 0);
        ctx.closePath();
        fillStroke(ctx, "#9db4c9");
        polyPath(ctx, [[0.08, 0.775], [0.055, 0.745], [0.065, 0.775]]);
        fillStroke(ctx, "#9db4c9");
      }
    },
    {
      instruction: "Add two seagulls flying near the sails.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawBird(ctx, 0.17, 0.24, 0.018);
        drawBird(ctx, 0.24, 0.17, 0.015);
      }
    },
    {
      instruction: "Add a sun with rays in the top left corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawSun(ctx, 0.1, 0.1, 0.048);
      }
    },
    {
      instruction: "Float a puffy cloud in the top right of the sky.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawCloud(ctx, 0.8, 0.13, 0.038);
      }
    },
    {
      instruction: "Put a treasure chest on deck: a small box with a curved lid and a lock dot.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.55, 0.575, 0.07, 0.045, 0.008);
        fillStroke(ctx, BROWN_DARK);
        ctx.beginPath();
        ctx.moveTo(0.55, 0.575);
        ctx.quadraticCurveTo(0.585, 0.548, 0.62, 0.575);
        ctx.stroke();
        circlePath(ctx, 0.585, 0.594, 0.007);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Finish with a little cannon on deck pointing off the front of the ship.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.66, 0.578, 0.08, 0.028, 0.012);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.685, 0.617, 0.016);
        fillStroke(ctx, BROWN_DARK);
      }
    }
  ];

  // ---------------------------------------------------------------------
  // LONG: Train (22 steps)
  // ---------------------------------------------------------------------

  var trainSteps = [
    {
      instruction: "Draw the track: two long rails across the bottom with short tie lines between them.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.moveTo(0.04, 0.8);
        ctx.lineTo(0.96, 0.8);
        ctx.moveTo(0.04, 0.84);
        ctx.lineTo(0.96, 0.84);
        ctx.stroke();
        ctx.beginPath();
        for (var x = 0.08; x < 0.95; x += 0.09) {
          ctx.moveTo(x, 0.8);
          ctx.lineTo(x, 0.84);
        }
        ctx.stroke();
      }
    },
    {
      instruction: "Draw a long rectangle sitting on the track, toward the left. That's the engine's boiler.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.14, 0.56, 0.24, 0.16, 0.02);
        fillStroke(ctx, RED);
      }
    },
    {
      instruction: "Add a taller cab behind the boiler, with a flat roof sticking out.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.38, 0.48, 0.14, 0.24, 0.015);
        fillStroke(ctx, RED_DARK);
        rectPath(ctx, 0.365, 0.455, 0.17, 0.03, 0.01);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Draw a chimney funnel near the front of the boiler, with a wider lip on top.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.18, 0.46, 0.05, 0.1, 0);
        fillStroke(ctx, GRAY_DARK);
        rectPath(ctx, 0.168, 0.435, 0.074, 0.03, 0.01);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Add a little round dome on top of the boiler, behind the funnel.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.beginPath();
        ctx.arc(0.3, 0.56, 0.032, Math.PI, 0);
        ctx.closePath();
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Draw a triangle cowcatcher on the front, sloping down to the track.",
      draw: function (ctx) {
        strokeOutline(ctx);
        polyPath(ctx, [[0.14, 0.64], [0.14, 0.79], [0.05, 0.79]]);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Give the engine a round headlight on the front of the boiler.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.135, 0.59, 0.024);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Draw one big driving wheel under the cab.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.44, 0.75, 0.052);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.44, 0.75, 0.018);
        fillStroke(ctx, GRAY);
      }
    },
    {
      instruction: "Add two smaller wheels under the boiler.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.21, 0.76, 0.038);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.31, 0.76, 0.038);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.21, 0.76, 0.013);
        fillStroke(ctx, GRAY);
        circlePath(ctx, 0.31, 0.76, 0.013);
        fillStroke(ctx, GRAY);
      }
    },
    {
      instruction: "Connect the wheels with a straight coupling rod.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.014;
        linePath(ctx, [[0.21, 0.765], [0.31, 0.765], [0.44, 0.755]]);
        ctx.strokeStyle = GRAY;
        ctx.stroke();
        ctx.strokeStyle = INK;
      }
    },
    {
      instruction: "Draw a square window on the cab so the driver can see out.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.41, 0.51, 0.08, 0.08, 0.012);
        fillStroke(ctx, SKY);
      }
    },
    {
      instruction: "Add a green wagon behind the engine: a rectangle sitting on the track.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.56, 0.6, 0.16, 0.12, 0.015);
        fillStroke(ctx, GREEN);
      }
    },
    {
      instruction: "Give the green wagon two little wheels.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.6, 0.755, 0.032);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.68, 0.755, 0.032);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Pile bumpy lumps of coal on top of the green wagon.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.59, 0.588, 0.024);
        fillStroke(ctx, "#4a453e");
        circlePath(ctx, 0.63, 0.578, 0.028);
        fillStroke(ctx, "#4a453e");
        circlePath(ctx, 0.67, 0.583, 0.024);
        fillStroke(ctx, "#4a453e");
        circlePath(ctx, 0.7, 0.593, 0.019);
        fillStroke(ctx, "#4a453e");
      }
    },
    {
      instruction: "Add a blue wagon at the back: another rectangle on the track.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.76, 0.6, 0.16, 0.12, 0.015);
        fillStroke(ctx, SKY);
      }
    },
    {
      instruction: "Give the blue wagon two little wheels too.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.8, 0.755, 0.032);
        fillStroke(ctx, GRAY_DARK);
        circlePath(ctx, 0.88, 0.755, 0.032);
        fillStroke(ctx, GRAY_DARK);
      }
    },
    {
      instruction: "Stack two parcel boxes on top of the blue wagon.",
      draw: function (ctx) {
        strokeOutline(ctx);
        rectPath(ctx, 0.78, 0.548, 0.05, 0.052, 0);
        fillStroke(ctx, BROWN);
        rectPath(ctx, 0.84, 0.553, 0.06, 0.047, 0);
        fillStroke(ctx, YELLOW);
      }
    },
    {
      instruction: "Link everything together with short coupling bars between the engine and wagons.",
      draw: function (ctx) {
        strokeOutline(ctx);
        ctx.lineWidth = 0.016;
        ctx.beginPath();
        ctx.moveTo(0.52, 0.7);
        ctx.lineTo(0.56, 0.7);
        ctx.moveTo(0.72, 0.7);
        ctx.lineTo(0.76, 0.7);
        ctx.stroke();
      }
    },
    {
      instruction: "Puff four smoke clouds drifting back from the funnel, growing bigger.",
      draw: function (ctx) {
        strokeOutline(ctx);
        circlePath(ctx, 0.21, 0.39, 0.024);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.245, 0.32, 0.03);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.29, 0.25, 0.038);
        fillStroke(ctx, GRAY_LIGHT);
        circlePath(ctx, 0.35, 0.19, 0.044);
        fillStroke(ctx, GRAY_LIGHT);
      }
    },
    {
      instruction: "Add a sun with rays in the top right corner.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawSun(ctx, 0.88, 0.12, 0.05);
      }
    },
    {
      instruction: "Float two puffy clouds high in the sky.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawCloud(ctx, 0.58, 0.12, 0.035);
        drawCloud(ctx, 0.74, 0.2, 0.028);
      }
    },
    {
      instruction: "Finish with two little birds flying above the smoke.",
      draw: function (ctx) {
        strokeOutline(ctx);
        drawBird(ctx, 0.45, 0.14, 0.018);
        drawBird(ctx, 0.52, 0.09, 0.015);
      }
    }
  ];

  // ---------------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------------

  window.SBS.CATEGORIES = [
    { id: "short", label: "Short", hint: "5–10 steps" },
    { id: "medium", label: "Medium", hint: "10–20 steps" },
    { id: "long", label: "Long", hint: "20–30 steps" }
  ];

  window.SBS.SUBJECTS = {
    dog: { id: "dog", label: "Dog", category: "short", steps: dogSteps },
    cat: { id: "cat", label: "Cat", category: "short", steps: catSteps },
    fish: { id: "fish", label: "Fish", category: "short", steps: fishSteps },
    rocket: { id: "rocket", label: "Rocket", category: "medium", steps: rocketSteps },
    house: { id: "house", label: "House", category: "medium", steps: houseSteps },
    robot: { id: "robot", label: "Robot", category: "medium", steps: robotSteps },
    castle: { id: "castle", label: "Castle", category: "long", steps: castleSteps },
    ship: { id: "ship", label: "Pirate Ship", category: "long", steps: shipSteps },
    train: { id: "train", label: "Train", category: "long", steps: trainSteps }
  };
})();

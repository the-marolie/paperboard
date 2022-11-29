/**
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 * https://github.com/fabricjs/fabric.js/blob/master/lib/centering_guidelines.js
 */
function initCenteringGuidelines(canvas) {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const canvasWidthCenter = canvasWidth / 2;
  const canvasHeightCenter = canvasHeight / 2;
  const canvasWidthCenterMap = {};
  const canvasHeightCenterMap = {};
  const centerLineMargin = 4;
  const centerLineColor = "rgba(255,0,241,0.5)";
  const centerLineWidth = 1;
  const ctx = canvas.getSelectionContext();
  let viewportTransform;

  for (
    var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasWidthCenterMap[Math.round(i)] = true;
  }
  for (
    var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin;
    i <= len;
    i++
  ) {
    canvasHeightCenterMap[Math.round(i)] = true;
  }

  function showVerticalCenterLine() {
    showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
  }

  function showHorizontalCenterLine() {
    showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
  }

  function showCenterLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = centerLineColor;
    ctx.lineWidth = centerLineWidth;
    ctx.beginPath();
    ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
    ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
    ctx.stroke();
    ctx.restore();
  }

  const afterRenderActions = [];
  let isInVerticalCenter;
  let isInHorizontalCenter;

  canvas.on("mouse:down", function () {
    viewportTransform = canvas.viewportTransform;
  });

  canvas.on("object:moving", function (e) {
    const object = e.target;
    const objectCenter = object.getCenterPoint();
    const transform = canvas._currentTransform;

    if (!transform) return;

    (isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
      (isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap);

    if (isInHorizontalCenter || isInVerticalCenter) {
      object.setPositionByOrigin(
        new fabric.Point(
          isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
          isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
        ),
        "center",
        "center"
      );
    }
  });

  canvas.on("before:render", function () {
    canvas.clearContext(canvas.contextTop);
  });

  canvas.on("after:render", function () {
    if (isInVerticalCenter) {
      showVerticalCenterLine();
    }
    if (isInHorizontalCenter) {
      showHorizontalCenterLine();
    }
  });

  canvas.on("mouse:up", function () {
    // clear these values, to stop drawing guidelines once mouse is up
    isInVerticalCenter = isInHorizontalCenter = null;
    canvas.renderAll();
  });
}

export default initCenteringGuidelines;

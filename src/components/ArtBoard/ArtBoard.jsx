import { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";

function ArtBoard() {
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (editor?.canvas) {
      editor?.canvas.setBackgroundColor(
        "white",
        editor?.canvas.renderAll.bind(editor.canvas)
      );
      // set canvas size to 100% of parent
      editor?.canvas.setWidth("800");
      editor?.canvas.setHeight("800");
      // enable canvas pan
      editor.canvas.allowTouchScrolling = true;
      initEventListeners(editor.canvas);
    }
  }, [editor]);

  const initEventListeners = (canvas) => {
    canvas.on("mouse:down", function (opt) {
      const evt = opt.e;
      if (evt.altKey === true) {
        canvas.isDragging = true;
        canvas.selection = false;
        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;
      }
    });
    canvas.on("mouse:move", function (opt) {
      if (canvas.isDragging) {
        const { e } = opt;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      }
    });
    canvas.on("mouse:up", function (opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      canvas.setViewportTransform(canvas.viewportTransform);
      canvas.isDragging = false;
      canvas.selection = true;
    });

    canvas.on("mouse:wheel", function (opt) {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };

  // function to resize canvas to fit parent container
  const resizeCanvas = () => {
    const canvas = editor?.canvas;
    const container = canvas?.container;
    const containerWidth = container?.offsetWidth;
    const containerHeight = container?.offsetHeight;
    const containerRatio = containerWidth / containerHeight;
    const canvasRatio = canvas?.width / canvas?.height;
    if (containerRatio < canvasRatio) {
      canvas?.setHeight(containerHeight);
      canvas?.setWidth(containerHeight * canvasRatio);
    } else {
      canvas?.setWidth(containerWidth);
      canvas?.setHeight(containerWidth / canvasRatio);
    }
    canvas?.calcOffset();
  };

  // function to change artboard canvas size and auto zoom to fit canvas
  const changeCanvasSize = (width, height) => {
    editor.canvas.setWidth(width);
    editor.canvas.setHeight(height);
    editor.canvas.calcOffset();
    editor.canvas.renderAll();
    editor.canvas.setZoom(1);
    editor.canvas.zoomToPoint(
      new fabric.Point(
        editor.canvas.getWidth() / 2,
        editor.canvas.getHeight() / 2
      ),
      1
    );
  };

  // function to zoom in and zoom out canvas
  const zoomCanvas = (zoom) => {
    editor?.canvas.setZoom(zoom);
  };

  // function to change canvas background color
  const changeCanvasColor = (color) => {
    editor?.canvas.setBackgroundColor(
      color,
      editor?.canvas.renderAll.bind(editor.canvas)
    );
  };

  // function to pan canvas
  const panCanvas = (x, y) => {
    editor?.canvas.relativePan(new fabric.Point(x, y));
  };

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  // function to add user input to canvas
  const onAddText = () => {
    editor?.addText("Sample text");
  };

  // function to change color of selected object
  const changeColor = (color) => {
    editor?.changeColor(color);
  };

  // function to change color of selected text object
  const changeTextColor = (color) => {
    editor?.changeTextColor(color);
  };
  // add a custom context menu to canvas
  const onAddContextMenu = () => {
    editor?.addContextMenu([
      {
        title: "Add Circle",
        action: onAddCircle,
      },
      {
        title: "Add Rectangle",
        action: onAddRectangle,
      },
      {
        title: "Add Text",
        action: onAddText,
      },
      {
        title: "Change Color",
        action: changeColor,
      },
      {
        title: "Change Text Color",
        action: changeTextColor,
      },
    ]);
  };

  return (
    <div>
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddText}>Add Text</button>
      <button onClick={onAddContextMenu}>Add Context Menu</button>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      <div className="artboard-toolbar">
        <button onClick={() => changeCanvasSize(800, 800)}>800x800</button>
        <button onClick={() => changeCanvasSize(1000, 1000)}>1000x1000</button>
        <button onClick={() => changeCanvasSize(1200, 1200)}>1200x1200</button>
        <button onClick={() => changeCanvasSize(1400, 1400)}>1400x1400</button>
        // zoom in and zoom out slider
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          defaultValue="1"
          onChange={(e) => zoomCanvas(e.target.value)}
        />
        // pan canvas slider
        <input
          type="range"
          min="-100"
          max="100"
          step="10"
          defaultValue="0"
          onChange={(e) => panCanvas(e.target.value, 0)}
        />
      </div>
    </div>
  );
}

export { ArtBoard };

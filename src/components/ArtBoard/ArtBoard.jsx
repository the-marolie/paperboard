import { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useGlobalStore } from "@S";

function ArtBoard() {
  const { editor, onReady } = useFabricJSEditor();
  const setEditor = useGlobalStore((state) => state.setEditor);

  useEffect(() => {
    if (editor?.canvas) {
      setEditor(editor);
      editor?.canvas.setBackgroundColor("white", editor?.canvas.renderAll.bind(editor.canvas));
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

  // function to change artboard canvas size and auto zoom to fit canvas
  const changeCanvasSize = (width, height) => {
    editor.canvas.setWidth(width);
    editor.canvas.setHeight(height);
    editor.canvas.calcOffset();
    editor.canvas.renderAll();
    editor.canvas.setZoom(1);
    editor.canvas.zoomToPoint(
      new fabric.Point(editor.canvas.getWidth() / 2, editor.canvas.getHeight() / 2),
      1
    );
  };

  // function to zoom in and zoom out canvas
  const zoomCanvas = (zoom) => {
    editor?.canvas.setZoom(zoom);
  };

  // function to change canvas background color
  const changeCanvasColor = (color) => {
    editor?.canvas.setBackgroundColor(color, editor?.canvas.renderAll.bind(editor.canvas));
  };

  // function to pan canvas
  const panCanvas = (x, y) => {
    editor?.canvas.relativePan(new fabric.Point(x, y));
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
        action: onAddCircle
      },
      {
        title: "Add Rectangle",
        action: onAddRectangle
      },
      {
        title: "Add Text",
        action: onAddText
      },
      {
        title: "Change Color",
        action: changeColor
      },
      {
        title: "Change Text Color",
        action: changeTextColor
      }
    ]);
  };

  return (
    <>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddText}>Add Text</button>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
    </>
  );
}

export { ArtBoard };

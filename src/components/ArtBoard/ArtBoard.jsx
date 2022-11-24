import { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

function ArtBoard() {
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    editor.canvas.setBackgroundColor(
      "white",
      editor.canvas.renderAll.bind(editor.canvas)
    );
    // set canvas size to 100% of parent
    editor.canvas.setWidth("800");
    editor.canvas.setHeight("800");
    // enable free drawing
    editor.canvas.isDrawingMode = true;
  }, []);

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  return (
    <div>
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
    </div>
  );
}

export { ArtBoard };

import React, { useState, useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useGlobalStore } from "@S";
import initAligningGuidelines from "@/lib/alignGuidelines";
import initCenteringGuidelines from "@/lib/centerGuidelines";
import codeFormatter from "@/lib/codeFormatter";
import jsPDF from "jspdf";

import 'styles.scoped.scss';


const getPPmm = () => {
  const dpi = window.devicePixelRatio;
  const inch = 25.4;
  return dpi * inch;
};
const ppmm = getPPmm();
const A4_WIDTH = 210 / 25.4 * ppmm;
const A4_HEIGHT = 297 / 25.4 * ppmm;

const ArtBoard = () => {
  const [codePreview, setCodePreview] = useState("");
  const { editor, onReady } = useFabricJSEditor();
  const setEditor = useGlobalStore((state) => state.setEditor);

  useEffect(() => {

    if (editor?.canvas) {
      setEditor(editor);
      editor?.canvas.setBackgroundColor("white", editor?.canvas.renderAll.bind(editor.canvas));
      // set canvas size to 100% of parent
      editor?.canvas.setWidth(A4_WIDTH);
      editor?.canvas.setHeight(A4_HEIGHT);
      // enable canvas pan
      editor.canvas.allowTouchScrolling = true;
      initEventListeners(editor.canvas);
      initAligningGuidelines(editor.canvas);
      initCenteringGuidelines(editor.canvas);
    }
  }, [editor]);

  const onAddText = () => {
    editor?.addText("Sample text");
  };

  const initEventListeners = (canvas) => {
    canvas.on("object:modified", function (e) {

      let object = e.target;

      // get the scale factor of the fabric js text object
      const jspdfWidth = 210; // end x coordinate of the jspdf document in millimeters
      const jspdfHeight = 297; // end y coordinate of the jspdf document in millimeters
      const scaleFactorX = jspdfWidth / A4_WIDTH;
      const scaleFactorY = jspdfHeight / A4_HEIGHT;
      const convertedLeft = (object.left * scaleFactorX);
      const convertedTop = (object.top * scaleFactorY);
      let fabricjsFontSize = 10; // Example font size in FabricJS



      const pdf = new jsPDF("portrait", "mm", "a4");
      pdf.text(`left: ${convertedLeft}mm, top: ${convertedTop}mm`, 10, 10);
      const code = `const pdf = new jsPDF("p", "mm", "a4");
      pdf.text(${convertedLeft}, ${convertedTop}, "${object.text}", );
      window.open(pdf.output('bloburi'), '_blank')`;
      setCodePreview(js_beautify(code, { indent_size: 2, space_in_empty_paren: true }));

    });
  };



  const handleDownload = () => {
    eval(codePreview);

  };


  return (
    <>
      <section class="main">
        <div class="container">
          <div class="canvas-container" style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
          }}>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
          </div>
          <div class="code-container">
            <pre>{codePreview}</pre>
          </div>
        </div>

        <div class="container">
          <div class="toolbar-container">
            <div class="toolbar">
              <button onClick={onAddText}>Add Text</button>
              <button onClick={handleDownload}>Save</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { ArtBoard };

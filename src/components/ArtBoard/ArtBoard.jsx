import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";


const ArtBoard = () => {
  const [codePreview, setCodePreview] = useState("");

  useEffect(() => {
    const getPPmm = () => {
      const dpi = window.devicePixelRatio;
      const inch = 25.4;
      return dpi * inch;
    };

    const ppmm = getPPmm();
    const A4_WIDTH = 210 / 25.4 * ppmm;
    const A4_HEIGHT = 297 / 25.4 * ppmm;

    const canvas = new fabric.Canvas("canvas", {
      backgroundColor: "#fff",
      width: A4_WIDTH,
      height: A4_HEIGHT,
      scaleX: 0,
      scaleY: 0,
    });

    const text = new fabric.IText("Hello, World!", {
      left: 50,
      top: 50,
      fontSize: 10,
    });

    canvas.add(text);

    canvas.on("object:added", function(options) {
      if (options.target.left < 0 || options.target.top < 0) {
        options.target.left = 0;
        options.target.top = 0;
      } else if (
        options.target.left + options.target.width > canvas.width ||
        options.target.top + options.target.height > canvas.height
      ) {
        options.target.left = canvas.width - options.target.width;
        options.target.top = canvas.height - options.target.height;
      }
    });

    canvas.on("object:modified", function(e) {
      let scaleFactor = text.getObjectScaling();
      // get the scale factor of the fabric js text object



  
  console.log(scaleFactor);
      const jspdfWidth = 210; // end x coordinate of the jspdf document in millimeters
const jspdfHeight = 297; // end y coordinate of the jspdf document in millimeters
const scaleFactorX = jspdfWidth / A4_WIDTH;
const scaleFactorY = jspdfHeight / A4_HEIGHT;
console.log(text.width/2);
      const convertedLeft = (text.left * scaleFactorX) ;
const convertedTop = (text.top * scaleFactorY);
let fabricjsFontSize = 10; // Example font size in FabricJS

let jspdfFontSize = fabricjsFontSize * scaleFactor; 

      const pdf = new jsPDF("portrait", "mm", "a4");
      pdf.text(`left: ${convertedLeft}mm, top: ${convertedTop}mm`, 10, 10);
      const code = `const pdf = new jsPDF("p", "mm", "a4");
      
pdf.text(${convertedLeft}, ${convertedTop}, "${text.text}", );
pdf.save("document.pdf");`;
      setCodePreview(code);
     
    });
  }, []);

  const handleDownload = () => {
    
    eval(codePreview);
    
  };
    

  return (
    <>
      <canvas id="canvas"></canvas>
      <pre>{codePreview}</pre>
      <button onClick={handleDownload}>Save</button>
    </>
  );
};

export { ArtBoard };

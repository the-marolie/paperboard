const generateJSPDF = (canvas) => {
  const objects = canvas.getObjects();
  let jspdf = new jsPDF();
  
  objects.forEach(object => {
    let type = object.type;
    let {left, top, scaleX, scaleY} = object;
    let ppmm = 25.4 / 96;
    let convertedLeft = left * ppmm;
    let convertedTop = (canvas.height - top) * ppmm;

    if (type === "text") {
      let {fontSize} = object;
      let convertedFontSize = fontSize * scaleX * ppmm;
      jspdf.setFontSize(convertedFontSize);
      jspdf.text(convertedLeft, convertedTop, object.text);
    } else if (type === "line") {
      let {x1, y1, x2, y2} = object;
      let convertedX1 = x1 * ppmm;
      let convertedY1 = (canvas.height - y1) * ppmm;
      let convertedX2 = x2 * ppmm;
      let convertedY2 = (canvas.height - y2) * ppmm;
      jspdf.line(convertedX1, convertedY1, convertedX2, convertedY2);
    }
  });

  return jspdf;
}

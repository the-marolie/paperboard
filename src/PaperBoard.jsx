import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { ArtBoard, Header } from "@C";
import "./assets/scss/paperboard.scss";

function PaperBoard() {
  return (
    <>
      <Header />
      <section className="paperboard-container">
        <ArtBoard />
      </section>
    </>
  );
}

export default PaperBoard;

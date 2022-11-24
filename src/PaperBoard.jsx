import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { ArtBoard } from "@C";
import "./assets/scss/paperboard.scss";

function PaperBoard() {
  return (
    <>
      <section className="header">
        <header className="App-header">
          <img src={reactLogo} className="App-logo" alt="logo" />
        </header>
      </section>
      <section className="board-container">
        <ArtBoard />
      </section>
    </>
  );
}

export default PaperBoard;

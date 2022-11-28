import reactLogo from "@A/react.svg";
import { useGlobalStore } from "@S";

function Header() {
  const { editor } = useGlobalStore((state) => state);

  const onAddCircle = () => {
    editor?.addCircle();
  };

  return (
    <section className="header">
      <header className="app-header">
        <div className="paperboard-logo">
          <img src={reactLogo} className="App-logo" alt="logo" />
        </div>
        <div className="artboard-toolbar">
          <button onClick={onAddCircle}>Add circle</button>
        </div>
      </header>
    </section>
  );
}

export { Header };

import BrandLogo from "@A/images/logo-red.png";
import { useGlobalStore } from "@S";

function Header() {
  const { editor } = useGlobalStore((state) => state);

  const onArtboardSave = () => {
    const tmp = editor?.canvas.toDataURL({
      format: "png"
    });
    // download image
    const link = document.createElement("a");
    link.download = "artboard.png";
    link.href = tmp;
    link.click();
  };

  return (
    <header className="app-header">
      <div className="paperboard-logo">
        <img src={BrandLogo} className="App-logo" alt="logo" />
      </div>
      <div className="header-toolbar">
        <button onClick={onArtboardSave}>Save</button>
      </div>
    </header>
  );
}

export { Header };

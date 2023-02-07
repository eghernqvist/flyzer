import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import reactLogo from "../assets/react.svg";
import tauriLogo from "../assets/tauri.svg";
import nextLogo from "../assets/next.svg";

function App() {
  return (
    <div className="container">
      <button onClick={async () => invoke("open_window")}>Open flyff!</button>
    </div>
  );
}

export default App;

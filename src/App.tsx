import { useState, ReactNode } from "react";

import UsingPureReact from "./components/UsingPureReact";
import UsingReactReducer from "./components/UsingReactReducer";
import UsingXState from "./components/UsingXState";
import UsingZustand from "./components/UsingZustand";

import "./App.css";

function App() {
  const [type, setType] = useState<StateType>("pure-react");

  let stateComponent: ReactNode = null;
  switch (type) {
    case "pure-react":
      stateComponent = <UsingPureReact />;
      break;
    case "react-reducer":
      stateComponent = <UsingReactReducer />;
      break;
    case "x-state":
      stateComponent = <UsingXState />;
      break;
    case "zustand":
      stateComponent = <UsingZustand />;
      break;
  }

  return (
    <nav>
      <h3>Controlling video using diffrent state libraries</h3>
      <menu>
        <button
          className={type === "pure-react" ? "active" : ""}
          onClick={() => setType("pure-react")}
        >
          pure-react
        </button>
        <button
          className={type === "react-reducer" ? "active" : ""}
          onClick={() => setType("react-reducer")}
        >
          React Reducer
        </button>
        <button
          className={type === "x-state" ? "active" : ""}
          onClick={() => setType("x-state")}
        >
          X State
        </button>
        <button
          className={type === "zustand" ? "active" : ""}
          onClick={() => setType("zustand")}
        >
          Zustand
        </button>
      </menu>
      <main>{stateComponent}</main>
    </nav>
  );
}

type StateType =
  | "pure-react"
  | "react-reducer"
  | "x-state"
  | "redux"
  | "zustand"
  | "recoil";

export default App;

import { useState } from "react";
import styles from "./App.module.css";
import { useInterpolation } from "./hooks/use-interpolation";

const lr = () => Math.floor(Math.random() * 1000);

const getRandomTensor = () => [lr(), [[lr()], lr(), lr()], [lr(), lr(), lr()]];

function App() {
  /** normal use state */
  const [discreetState, setdiscreetState] = useState<number>(0);

  const [rT, setrT] = useInterpolation(getRandomTensor());

  /** Interpolation with extra arguments */
  const [lerpedState, setlerpedState, _, target] = useInterpolation<number>(
    0, // initial state
    0.1, // duration, default: 1.5
    "ease-in-out", // animation type, default: "lerp"
    60 // fps, default: 50
  );

  return (
    <div
      onWheel={(e) => {
        const add = e.deltaY / 10;
        console.log(add);
        setdiscreetState(discreetState + add);
        setlerpedState(target + add);
      }}
      className={`${styles.App}`}
    >
      <h1 style={{ color: "white" }}>{JSON.stringify(rT)}</h1>
      <button onClick={() => setrT(getRandomTensor())}>
        Randomize
      </button>
      <div
        style={{
          left: `clamp(calc(0vw  + 5rem), ${discreetState}rem, calc(100vw - 5rem))`,
        }}
        className={`${styles.Ball}`}
      ></div>
      <div
        style={{
          left: `clamp(calc(0vw  + 5rem), ${lerpedState}rem, calc(100vw - 5rem))`,
        }}
        className={`${styles.Ball} ${styles.Ball2}`}
      ></div>
    </div>
  );
}

export default App;

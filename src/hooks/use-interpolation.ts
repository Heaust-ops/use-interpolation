import { useState, useEffect } from "react";

type Tensor = Array<number | Tensor>

const lerp = <T extends number | Tensor>(
  from: T,
  to: T,
  fraction: number
) => {
  const A = from;
  const B = to;
  if (typeof A !== typeof B)
    throw new Error("Lerp arguments must be the same type");

  if (typeof A === "number") return A + ((B as number) - A) * fraction;

  if ((A as number[]).length !== (B as number[]).length)
    throw new Error("Lerp arguments must have the same dimensions");

  const lerped = [] as number[];
  for (let i = 0; i < A.length; i++) {
    lerped.push(lerp(A[i], (B as number[])[i], fraction) as number);
  }

  return lerped;
};

const smoothstep = <T extends number | Tensor>(
  from: T,
  to: T,
  fraction: number
) => {
  const A = from;
  const B = to;
  if (typeof A !== typeof B)
    throw new Error("Lerp arguments must be the same type");

  if (typeof A === "number") {
    if (A === B) return A;
    const value = lerp(A, B, fraction) as number;
    const x = Math.max(0, Math.min(1, (value - A) / ((B as number) - A)));
    const frac = x * x * (3 - 2 * x);
    return lerp(A, B, frac) as number;
  }

  if ((A as number[]).length !== (B as number[]).length)
    throw new Error("Lerp arguments must have the same dimensions");

  const lerped = [] as number[];
  for (let i = 0; i < A.length; i++) {
    lerped.push(smoothstep(A[i], (B as number[])[i], fraction) as number);
  }

  return lerped;
};

/**
 * This hook works with numbers and tensors,
 * the tensor shape once initialized is fixed,
 *
 * when you set the value with this hook,
 * it smoothly interpolates to the next value,
 *
 * Use this hook like so,
 *
 * ```
 * const initialPosition = [0,0,1];
 * const duration = 2; // seconds
 * const [position, setPosition, setDuration] = useInterpolation(initialPosition, duration);
 * ```
 *
 * Or alternatively,
 *
 * ```
 * const initialValue = 24;
 * const duration = 2; // seconds
 * const [value, setValue, setDuration] = useInterpolation(initialValue, duration);
 * ```
 *
 * you can also pass in additional arguments for the animation type and fps,
 * the default animation type is "lerp", but you can also use "ease-in-out"
 * the default fps is 60,
 * here's an example of utilizing all arguments,
 *
 * ```
 * const initialPosition = [0,0,1];
 * const duration = 2; // seconds
 * const [position, setPosition, setDuration] = useInterpolation(initialPosition, duration, "ease-in-out", 144);
 * ```
 *
 * @param initialState the initial state, could be a number, vector or tensor
 * @param duration the duration of the animation
 * @param method type of animation, "lerp" or "ease-in-out"
 * @param fps the framerate, 60fps by default
 * @returns [ current state, state setter, duration setter, current target ]
 */
export const useInterpolation = <T extends number | Tensor>(
  initialState: T,
  duration = 1.5,
  method: "lerp" | "ease-in-out" = "lerp",
  fps = 60
) => {
  const [period, setperiod] = useState(duration);
  const [target, settarget] = useState(initialState);
  const [start, setstart] = useState(initialState);
  const [startTime, setstartTime] = useState(Date.now());
  const [current, setcurrent] = useState(initialState);
  const interpolate = { lerp, "ease-in-out": smoothstep }[method];

  useEffect(() => {
    setstart(current);
    setstartTime(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, target]);

  useEffect(() => {
    let timeOutId: number;
    const update = () => {
      const fraction = (Date.now() - startTime) / (period * 1000);
      if (fraction > 1) {
        if (current !== target) setcurrent(target);
        return;
      }
      setcurrent(interpolate(start, target, fraction) as T);
    };

    timeOutId = setTimeout(update, Math.floor(1000 / fps));

    return () => clearTimeout(timeOutId);
  }, [period, start, startTime, target, current]);

  return [current, settarget, setperiod, target] as [
    T,
    (initialState: T) => void,
    (initialState: T) => void,
    T
  ];
};

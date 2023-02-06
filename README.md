## use-interpolation

This is a react hook that works with numbers and tensors,
the tensor shape once initialized is fixed,

when you set the value with this hook,
it smoothly interpolates to the next value,

Use this hook like so,

```
const initialPosition = [0,0,1];
const duration = 2; // seconds
const [position, setPosition, setDuration] = useInterpolation(initialPosition, duration);
```

Or alternatively,

```
const initialValue = 24;
const duration = 2; // seconds
const [value, setValue, setDuration] = useInterpolation(initialValue, duration);
```

you can also pass in additional arguments for the animation type and fps,
the default animation type is "lerp", but you can also use "ease-in-out"
the default fps is 60,
here's an example of utilizing all arguments,

```
const initialPosition = [0,0,1];
const duration = 2; // seconds
const [position, setPosition, setDuration] = useInterpolation(initialPosition, duration, "ease-in-out", 144);
```
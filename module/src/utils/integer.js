import clamp from "./clamp";

const integer = (value, previous, min, max) => {
  const int = parseInt(value)
  return isNaN(int) ? previous : clamp(int, min, max)
}

export default integer
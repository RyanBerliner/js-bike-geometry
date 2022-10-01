export function bound(val, min, max) {
  if (val >= min && val <= max) return val;
  if (val < min) return min;
  return max;
}

export function normalizeToRange(val, currentRange, newRange) {
  const currentDelta = currentRange[1] - currentRange[0];
  const newDelta = newRange[1] - newRange[0];
  const factor = newDelta / currentDelta;
  return newRange[0] + (factor * val);
}

export function easeInOutCubic (time, startVal, endVal, duration) {
  const change = endVal - startVal;
  if ((time /= duration / 2) < 1) return change / 2 * time * time * time + startVal;
  return change / 2 * ((time -= 2) * time * time + 2) + startVal;
}
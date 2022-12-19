export function bound(val, min, max) {
  if (val >= min && val <= max) return val;
  if (val < min) return min;
  return max;
}

export function distributeToRange(val, currentRange, newRange) {
  const currentDelta = currentRange[1] - currentRange[0];
  const newDelta = newRange[1] - newRange[0];
  const factor = newDelta / currentDelta;
  return newRange[0] + (factor * val);
}

export function easeInOutCubic(time, startVal, endVal, duration) {
  const change = endVal - startVal;
  // bunch of cool pre-written easing functions
  // https://spicyyoghurt.com/tools/easing-functions
  if ((time /= duration / 2) < 1) return change / 2 * time * time * time + startVal;
  return change / 2 * ((time -= 2) * time * time + 2) + startVal;
}

export function hash(string) {
  // https://stackoverflow.com/q/7616461/

  let hash = 0;
  let i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return hash;
}
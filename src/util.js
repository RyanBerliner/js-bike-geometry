export function bound(val, min, max) {
  if (val >= min && val <= max) return val;
  if (val < min) return min;
  return max;
}
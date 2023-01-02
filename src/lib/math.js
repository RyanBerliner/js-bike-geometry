export function ymxb(m, b) {
  return (x) => {
    return (m * x) + b;
  }
}

export function getLineFunc(x1, x2, y1, y2) {
  let m = (y1 - y2) / (x1 - x2);
  const b = y1 - (m * x1);

  let func = ymxb(m, b);

  if (Math.abs(m) === Infinity) {
    func = x1;
    m = Math.abs(m);
  }

  return { func, m, b }
}

export function perpLineFunc(line1, x1, y1) {
  let m = -1 / line1.m;
  const b = y1 - (m * x1)

  let func = ymxb(m, b);

  if (Math.abs(m) === Infinity) {
    func = x1;
    m = Math.abs(m);
  }

  return { func, m, b }
}

export function lineIntersection(line1, line2) {
  const {m: m1, b: b1, func: func1} = line1;
  const {m: m2, b: b2, func: func2} = line2

  if (m1 === Infinity || m2 === Infinity) {
    if (m1 === Infinity && m2 === Infinity) {
      return [undefined, undefined];
    }

    if (m1 === Infinity) {
      return [func1, func2(func1)]
    }

    return [func2, func1(func2)]
  }

  const intersectX = (b1 - b2) / (m2 - m1),
        intersectY = func1(intersectX);

  return [intersectX, intersectY];
}

export function distanceFromLine(line, x1, y1) {
  const perp = perpLineFunc(line, x1, y1);
  const [x2, y2] = lineIntersection(line, perp);
  return [
    distanceBetweenPoints(x1, x2, y1, y2),
    x2,
    y2
  ];
}

export function distanceBetweenPoints(x1, x2, y1, y2) {
  return hypo(x2 - x1, y2 - y1);
}

export function hypo(s1, s2) {
  return Math.sqrt(Math.pow(s1, 2) + Math.pow(s2, 2));
}

export function isBetween(num, a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return num >= min && num <= max;
}
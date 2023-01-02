import {
  distanceBetweenPoints,
  getLineFunc,
  hypo,
  isBetween,
  distanceFromLine as distanceFromLineFunc,
} from './math';

// we want the data stored in a distortion map to be sotred in local storage
// as its expensive to move around large objects in memory and we don't
// actually access the map data all that much

export class DistortionMap {
  constructor(layerId) {
    this.layerId = layerId;
  }

  get map() { return this._map; }
  set map(points) { this._map = points; }
}

function ensurePoint(points, x, y) {
  if (!points[y]) points[y] = {};
  if (!points[y][x]) points[y][x] = 0;
}

export function pointsToBrushFill(points, brushSettings) {
  const {size, fade, opacity} = brushSettings;
  const radius = Math.floor(size / 2);
  const startFade = radius * (fade / 100);

  const finalPoints = {};
  let previousPoint;
  points.forEach(([x, y]) => {
      x = parseInt(x);
      y = parseInt(y);

      ensurePoint(finalPoints, x, y);

      const fullValue = opacity / 100;
      finalPoints[y][x] = fullValue;

      let lineFunc = null;
      let halfBoxSide = radius;

      if (previousPoint) {
        lineFunc = getLineFunc(x, previousPoint[0], y, previousPoint[1]);
        halfBoxSide = Math.ceil(distanceBetweenPoints(x, previousPoint[0], y, previousPoint[1]) + halfBoxSide);
      }

      for (let dx = -1 * halfBoxSide; dx < halfBoxSide; dx++) {
        for (let dy = -1 * halfBoxSide; dy < halfBoxSide; dy++) {
          const px = x + dx, py = y + dy;
          let distanceFromPoint = hypo(dx, dy);
          let distanceFromLine = Infinity;

          if (lineFunc) {
            let [distance, ix, iy] = distanceFromLineFunc(lineFunc, px, py);
            const distanceFromPreviousPoint = distanceBetweenPoints(px, previousPoint[0], py, previousPoint[1]);
            if (!isBetween(ix, x, previousPoint[0]) || !isBetween(iy, y, previousPoint[1])) {
              distance = Math.min(distanceFromPoint, distanceFromPreviousPoint);
            }

            distanceFromLine = distance;
          }

          const validDistanceFromLine = !isNaN(distanceFromLine) && distanceFromLine < radius;
          const validDistanceFromPoint = distanceFromPoint < radius;
          if (!validDistanceFromLine && !validDistanceFromPoint) {
            continue;
          }

          let offset = distanceFromPoint;
          if (validDistanceFromLine) {
            offset = Math.min(distanceFromLine, distanceFromPoint);
          }

          let value = fullValue;
          if (offset > startFade) {
            const adjRad = radius - startFade;
            const adjOff = offset - startFade;
            value = ((adjRad - adjOff) / adjRad) * value;
          }

          ensurePoint(finalPoints, px, py);
          finalPoints[py][px] = Math.max(value, finalPoints[py][px]);
        }
      }

      previousPoint = [x, y];
  });

  return finalPoints;
}

export function mapMerge(map, points, brushSettings) {
  if (!map) {
    map = {}
  }

  points = pointsToBrushFill(points, brushSettings)
  const {mode} = brushSettings;

  Object.keys(points).forEach((y) => {
    Object.keys(points[y]).forEach((x) => {
      ensurePoint(map, x, y);
      map[y][x] = mode === 'brush'
        ? Math.min(1, map[y][x] + points[y][x])
        : Math.max(0, map[y][x] - points[y][x]);

      if (map[y][x] === 0) {
        delete map[y][x];
      }
    });
  });

  return map;
};
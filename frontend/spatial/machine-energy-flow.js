const EPSILON = 1e-9;

const finite = (value) => Number.isFinite(Number(value));

function normalizePoint(point) {
  if (!finite(point?.x) || !finite(point?.y) || !finite(point?.z)) return null;
  return Object.freeze({
    x: Number(point.x),
    y: Number(point.y),
    z: Number(point.z),
  });
}

export function normalizeElectricalRoute(route = []) {
  if (!Array.isArray(route)) return Object.freeze([]);
  const points = [];
  for (const point of route) {
    const normalized = normalizePoint(point);
    if (!normalized) return Object.freeze([]);
    const previous = points.at(-1);
    if (!previous || Math.abs(previous.x - normalized.x) > EPSILON || Math.abs(previous.y - normalized.y) > EPSILON || Math.abs(previous.z - normalized.z) > EPSILON) {
      points.push(normalized);
    }
  }
  return Object.freeze(points);
}

export function electricalRouteLength(route = []) {
  const points = normalizeElectricalRoute(route);
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
      points[i].z - points[i - 1].z,
    );
  }
  return total;
}

export function electricalRoutePoint(route, amount = 0) {
  const points = normalizeElectricalRoute(route);
  if (!points.length) return null;
  if (points.length === 1) return points[0];
  const total = electricalRouteLength(points);
  if (total <= EPSILON) return points[points.length - 1];
  const target = Math.max(0, Math.min(1, Number(amount) || 0)) * total;
  let traversed = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    if (traversed + segment >= target) {
      const t = segment <= EPSILON ? 0 : (target - traversed) / segment;
      return Object.freeze({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        z: a.z + (b.z - a.z) * t,
      });
    }
    traversed += segment;
  }
  return points.at(-1);
}

export function electricalRoutePrefix(route, amount = 0) {
  const points = normalizeElectricalRoute(route);
  if (points.length <= 1) return points;
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  if (t <= 0) return Object.freeze([points[0]]);
  if (t >= 1) return points;
  const total = electricalRouteLength(points);
  const target = total * t;
  const prefix = [points[0]];
  let traversed = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    if (traversed + segment < target) {
      prefix.push(b);
      traversed += segment;
      continue;
    }
    const local = segment <= EPSILON ? 0 : (target - traversed) / segment;
    prefix.push({
      x: a.x + (b.x - a.x) * local,
      y: a.y + (b.y - a.y) * local,
      z: a.z + (b.z - a.z) * local,
    });
    break;
  }
  return Object.freeze(prefix);
}

export function resolveElectricalEdgeRoute(edge) {
  if (Array.isArray(edge?.route) && edge.route.length >= 2) {
    const route = normalizeElectricalRoute(edge.route);
    return route.length >= 2 ? route : Object.freeze([]);
  }
  if (edge?.source && edge?.target) {
    const route = normalizeElectricalRoute([edge.source, edge.target]);
    return route.length >= 2 ? route : Object.freeze([]);
  }
  if (edge?.from && edge?.to) {
    const route = normalizeElectricalRoute([edge.from, edge.to]);
    return route.length >= 2 ? route : Object.freeze([]);
  }
  return Object.freeze([]);
}

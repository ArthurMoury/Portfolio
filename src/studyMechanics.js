export const unit = value => Math.max(0, Math.min(1, value));
export function blend(value) {
  const x = unit(value);
  return x * x * (3 - 2 * x);
}
export const options = [1, 2, 0];
export const leafPositions = [-1.25, -0.42, 0.42, 1.25];

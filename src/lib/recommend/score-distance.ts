export function scoreDistance(distanceMeters: number) {
  if (distanceMeters <= 350) {
    return 100;
  }

  if (distanceMeters <= 550) {
    return 82;
  }

  if (distanceMeters <= 800) {
    return 64;
  }

  if (distanceMeters <= 1100) {
    return 46;
  }

  return 28;
}

export type MouthShape = {
  width: number;  // How wide the mouth is (horizontal)
  height: number; // How open the mouth is (vertical)
};

const SHAPES: Record<string, MouthShape> = {
  closed: { width: 60, height: 0 },   // M, P, B (Flat line)
  open_O: { width: 40, height: 70 },  // O, U, W (Tall circle)
  wide_E: { width: 100, height: 20 }, // E, S, D, T, Z (Wide smile)
  open_A: { width: 80, height: 50 },  // A, H, R (Big open)
  neutral: { width: 70, height: 10 }, // Resting state
};

export const getMouthShape = (char: string): MouthShape => {
  const c = char.toLowerCase();

  if ("mbp".includes(c)) return SHAPES.closed;
  if ("ouq".includes(c)) return SHAPES.open_O;
  if ("esdtzckgl".includes(c)) return SHAPES.wide_E;
  if ("ahr".includes(c)) return SHAPES.open_A;
  if (c === " ") return SHAPES.neutral; // Space = Rest

  return SHAPES.neutral; // Default
};
export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  color: string;
  width: number;
  points: Point[];
};
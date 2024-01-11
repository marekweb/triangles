type PointJumpDirection = 'NNW' | 'NNE' | 'SSW' | 'SSE';

type Direction =
  | 'E'
  | 'NW'
  | 'SW'
  | 'W'
  | '+Y'
  | '-X'
  | 'NE'
  | 'N'
  | '-Y'
  | 'SE'
  | 'S'
  | '+X'
  | PointJumpDirection;

interface PixelCoordinate {
  x: number;
  y: number;
}

type PixelCoordinateTriple = [
  PixelCoordinate,
  PixelCoordinate,
  PixelCoordinate,
];

interface PointCoordinate {
  x: number;
  y: number;
}

interface TriangleCoordinate {
  x: number;
  y: number;
  z: 0 | 1;
}

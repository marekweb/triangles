type TriangleCoordinate = [number, number, 0 | 1];

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

type PixelCoordinate = [number, number];
type PointCoordinate = [number, number];

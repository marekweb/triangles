import { delay, randomInt } from "./draw";
import type { Grid } from "./grid";
import type { Point } from "./point";
import type { Triangle } from "./triangle";

export function drawRing(center: Point, size: number) {
	const side = 1 + size * 2;
	const apex = center.getAdjacentPoint("N", size);

	let tri = apex.getTriangle("NW");

	const directions: Direction[] = ["+X", "S", "+Y", "-X", "N", "-Y"];

	const sides: Triangle[][] = [];

	for (const direction of directions) {
		const sideTriangles: Triangle[] = [];
		sides.push(sideTriangles);
		for (let i = 0; i < side; i++) {
			tri = tri.getAdjacent(direction);
			sideTriangles.push(tri);
		}
	}

	return sides;
}

export default async function (grid: Grid) {
	const center = grid.getPointReference(0, 0);

	while (true) {
		const A = randomInt(3, 6) * 10;
		const B = randomInt(2, 20) * 6;
		const C = randomInt(3, 5);
		const D = randomInt(2, 7);
		const E = randomInt(0, 360);
		const F = randomInt(2, 6);

		const size = 14;

		for (let ringIndex = 0; ringIndex < size; ringIndex++) {
			const sides = drawRing(center, ringIndex);
			sides.forEach((side) =>
				side.forEach(
					(t, tIndex) => {
						// offset: from ring side center
						const offset = Math.abs(tIndex - ringIndex);
						if (
							// Blank some triangles on the ring
							ringIndex + offset === C ||
							offset === D ||
							// Blank some entire rings
							(ringIndex + 3) % F === 0
						) {
							t.setFill("black");
							return;
						}
						t.setFillHsl(
							E + offset * B + ringIndex * A,
							40 + ((offset % D) * 50) / D,
							70 - (80 / size) * ringIndex + 10,
						);
					},
					// )
				),
			);
			await delay(70);
		}

		await delay(5000);
	}
}

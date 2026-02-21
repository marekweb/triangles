import { drawCubeTower, randomChoice, randomInt } from "./draw";
import type { Grid } from "./grid";

export default async function cubePipes(grid: Grid) {
	let p = grid.getPointReference(0, 0);
	let hue = 0;
	const directions: Direction[] = ["N", "SW", "SE"];
	while (true) {
		let nextP, direction: Direction, distance;

		// Select a random direction and distance until you find one that doesn't
		// go off the screen.
		do {
			direction = randomChoice(directions);
			distance = randomInt(3, 8);
			nextP = p.getAdjacentPoint(direction, distance);
		} while (!nextP.isWithinScreen());

		hue = await drawCubeTower(p, direction, distance, hue, 400);
		hue = hue % 360;
		p = nextP;
	}
}

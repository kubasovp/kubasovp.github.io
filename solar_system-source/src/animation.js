import { state, canvas } from "./state.js";
import { updatePlanets, drawPlanets } from "./render/planets.js";
import { drawBackground } from "./render/background.js";
import { drawOrbits } from "./render/orbits.js";

export function animate(now) {
	const delta = now - state.lastTime;
	state.lastTime = now;

	updatePlanets(delta);
	drawBackground();
	drawOrbits();
	drawPlanets();

	requestAnimationFrame(animate);
}

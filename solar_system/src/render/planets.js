import { state, ctx } from "../state.js";
import { planets } from "../data/planets.js";

export function updatePlanets(delta) {
	for (let p of planets) {
		const angularSpeed = (2 * Math.PI) / (p.period * (state.YEAR_MS / 1000));
		p.angle += angularSpeed * (delta / 1000);
	}
}

export function drawPlanets() {
	for (let p of planets) {
		const a = p.dist * state.scale;
		const b = a * Math.sqrt(1 - (p.eccentricity || 0) ** 2);
		const x = state.cx + a * Math.cos(p.angle);
		const y = state.cy + b * Math.sin(p.angle);
		const radius = Math.max(1, (p.diameter / state.planetScale) / 2);

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = p.color;
		ctx.fill();

		if (state.showLabels) {
			ctx.fillStyle = "white";
			ctx.fillText(p.name, x + radius, y - radius);
		}
	}
}

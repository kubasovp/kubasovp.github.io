import { state, ctx } from "../state.js";
import { planets } from "../data/planets.js";

export function drawOrbits() {
	ctx.font = "10px sans-serif";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	for (let p of planets) {
		const a = p.dist * state.scale; // большая полуось
		const b = a * Math.sqrt(1 - (p.eccentricity || 0) ** 2); // малая полуось
		const cx = state.cx;
		const cy = state.cy;

		// орбита — эллипс
		ctx.beginPath();
		ctx.ellipse(cx, cy, a, b, 0, 0, 2 * Math.PI);
		ctx.strokeStyle = "rgba(255,255,255,0.2)";
		ctx.stroke();

		// метка на линейке (для крупных планет)
		if (["Mars", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(p.name)) {
			ctx.fillText(`${p.dist} млн км`, cx + a - 4, cy + 4);
		}
	}
}

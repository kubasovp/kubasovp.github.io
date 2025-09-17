import { planets } from "../data/planets.js";
import { state, ctx } from "../state.js";

export function drawOrbits() {
	ctx.font = "10px sans-serif";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";

	for (let p of planets) {
		const a = p.dist * state.scale; // большая полуось
		const e = p.eccentricity || 0;
		const b = a * Math.sqrt(1 - e ** 2); // малая полуось
		const f = a * e; // смещение фокуса
		const cx = state.cx - f; // центр эллипса смещён относительно Солнца
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

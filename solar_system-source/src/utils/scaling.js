import { state } from "../state.js";
import { planets } from "../data/planets.js";

export function updateScale(canvas, modeLabel) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	state.cx = canvas.width / 2;
	state.cy = canvas.height / 2;

	const maxDist = Math.max(...planets.map(p => p.dist));
	const side = (state.fitMode === "cover")
		? Math.max(canvas.width, canvas.height)
		: Math.min(canvas.width, canvas.height);

	state.scale = ((side - 32) / 2) / maxDist;
	state.planetScale = (canvas.width < 768) ? 4800 : 2000;

	modeLabel.style.display = (canvas.width === canvas.height) ? "none" : "inline-flex";
}

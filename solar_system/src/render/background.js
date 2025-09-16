import { state, ctx, canvas } from "../state.js";

export function drawBackground() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Солнце
	ctx.beginPath();
	ctx.arc(state.cx, state.cy, 3, 0, 2 * Math.PI);
	ctx.fillStyle = "yellow";
	ctx.fill();

	// Линейка
	ctx.beginPath();
	ctx.moveTo(state.cx, state.cy);
	ctx.lineTo(canvas.width, state.cy);
	ctx.strokeStyle = "rgba(255,255,255,0.5)";
	ctx.setLineDash([4, 4]);
	ctx.stroke();
	ctx.setLineDash([]);
}

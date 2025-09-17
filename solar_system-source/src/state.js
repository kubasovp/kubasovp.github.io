export const state = {
	fitMode: "cover",
	showLabels: false,
	scale: 1,
	planetScale: 2000,
	cx: 0,
	cy: 0,
	YEAR_MS: 2000,
	lastTime: performance.now()
};

export let ctx, canvas;
export function setCanvas(c) {
	canvas = c;
	ctx = c.getContext("2d");
}

// src/render/planets.js
import { state, ctx } from "../state.js";
import { planets } from "../data/planets.js";

// Решение уравнения Кеплера методом Ньютона
function solveKepler(M, e, iterations = 5) {
	let E = M;
	for (let i = 0; i < iterations; i++) {
		E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
	}
	return E;
}

export function updatePlanets(delta) {
	for (let p of planets) {
		const meanMotion = (2 * Math.PI) / p.period; // рад/год
		const dYears = delta / state.YEAR_MS; // прошедшее время в "годах"
		p.meanAnomaly = (p.meanAnomaly || Math.random() * 2 * Math.PI) + meanMotion * dYears;
	}
}

export function drawPlanets() {
	for (let p of planets) {
		const a = p.dist * state.scale; // большая полуось
		const e = p.eccentricity || 0;
		const b = a * Math.sqrt(1 - e ** 2); // малая полуось
		const f = a * e; // смещение фокуса
		const cx = state.cx - f; // центр эллипса смещён относительно Солнца
		const cy = state.cy;

		// решение уравнения Кеплера
		const E = solveKepler(p.meanAnomaly, e);

		// координаты планеты
		const x = cx + a * Math.cos(E); // поправка на фокус
		const y = cy + b * Math.sin(E);

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

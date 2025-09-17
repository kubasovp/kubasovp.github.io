export const planets = [
	{ name: "Mercury", dist: 58, diameter: 4879, period: 0.24, color: "gray", eccentricity: 0.205 },
	{ name: "Venus", dist: 108, diameter: 12104, period: 0.62, color: "khaki", eccentricity: 0.007 },
	{ name: "Earth", dist: 150, diameter: 12742, period: 1.00, color: "deepskyblue", eccentricity: 0.017 },
	{ name: "Mars", dist: 228, diameter: 6792, period: 1.88, color: "tomato", eccentricity: 0.093 },
	{ name: "Jupiter", dist: 778, diameter: 139820, period: 11.86, color: "orange", eccentricity: 0.049 },
	{ name: "Saturn", dist: 1430, diameter: 116460, period: 29.46, color: "gold", eccentricity: 0.056 },
	{ name: "Uranus", dist: 2870, diameter: 50724, period: 84.0, color: "lightblue", eccentricity: 0.046 },
	{ name: "Neptune", dist: 4500, diameter: 49244, period: 165.0, color: "blue", eccentricity: 0.010 }
].map(p => ({
	...p,
	M: Math.random() * 2 * Math.PI // стартовая средняя аномалия
}));

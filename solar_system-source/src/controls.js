import { state } from "./state.js";
import { updateScale } from "./utils/scaling.js";

export function bindControls({ speedSlider, speedLabel, fitRadios, modeLabel, labelsToggle, canvas }) {
	speedSlider.addEventListener("input", () => {
		state.YEAR_MS = +speedSlider.value;
		speedLabel.textContent = `1 год = ${(state.YEAR_MS / 1000).toFixed(1)} сек`;
	});

	fitRadios.forEach(radio => {
		radio.addEventListener("change", e => {
			state.fitMode = e.target.value;
			updateScale(canvas, modeLabel);
		});
	});

	labelsToggle.addEventListener("change", e => {
		state.showLabels = e.target.checked;
	});

	window.addEventListener("resize", () => updateScale(canvas, modeLabel));
}

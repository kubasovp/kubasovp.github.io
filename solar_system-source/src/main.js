import './style.scss'
import { setCanvas } from "./state.js";
import { updateScale } from "./utils/scaling.js";
import { bindControls } from "./controls.js";
import { animate } from "./animation.js";

const canvas = document.getElementById("solar");
const speedSlider = document.querySelector(".controls__slider");
const speedLabel = document.querySelector(".controls__value");
const fitRadios = document.querySelectorAll("input[name='fitMode']");
const modeLabel = document.querySelector(".fit-label");
const labelsToggle = document.getElementById("labelsToggle");

setCanvas(canvas);
updateScale(canvas, modeLabel);
bindControls({ speedSlider, speedLabel, fitRadios, modeLabel, labelsToggle, canvas });

requestAnimationFrame(animate);

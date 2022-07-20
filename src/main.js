import { Game } from "./game.js";

const game = new Game();
const playButton = document.getElementById("play-button");

game.showHighScores();
playButton.addEventListener("click", game.play.bind(game));

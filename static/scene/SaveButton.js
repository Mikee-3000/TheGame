import GameState from "../lib/GameState.js";

export default class SaveButton {
    constructor() {
        this.button = document.querySelector('.save-button');
        this.button.addEventListener('click', this.save.bind(this));
    }
    save() {
        const gameState = new GameState()
        console.log(gameState)
    }
    show() {
        this.button.classList.add('show')
    }
}
import GameState from "../lib/GameState.js"

export default class SaveButton {
    constructor() {
        this.button = document.querySelector('.save-button')
        this.button.addEventListener('click', this.save.bind(this))
        this.gameState = new GameState()
    }
    save() {
        console.log(this.gameState)
        // save the game using FetchAPI
        fetch('/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.gameState)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    }
    show() {
        this.button.classList.add('show')
    }
}
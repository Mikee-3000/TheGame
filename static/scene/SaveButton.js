import GameState from "../lib/GameState.js"

export default class SaveButton {
    constructor() {
        this.button = document.querySelector('.save-button')
        this.button.addEventListener('click', this.save.bind(this))
        this.gameState = new GameState()
    }
    save() {
        // save the game using FetchAPI
            const stateForSaving = this.gameState.getStateForSaving()
        fetch('/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.gameState.getStateForSaving())
        })
        .then(response => response.json())
        .then(data => {
            navigator.clipboard.writeText(data.saved_game_id)
            this.gameState.notification.show(
                'Game saved successfully! The game ID has been copied to your clipboard.You will need it to load the saved game.'
            )
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    }
    show() {
        this.button.classList.add('show')
    }
}
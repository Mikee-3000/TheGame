import * as THREE from 'three';
import GameState from './GameState.js';

export default class DataFetcher extends THREE.Loader {
    constructor(manager) {
        super(manager);
    }
    load(url, data) {
        const scope = this;
        // Increment the loading manager's item count
        scope.manager.itemStart(url);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'TheGame DataFetcher/1.0' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(responseData => {
                // Decrement the loading manager's item count
                scope.manager.itemEnd(url);
                // GameState is a singleton, its instance gets created before this is called
                let gameState = null
                try {
                    gameState = new GameState(null)
                } catch (error) {
                    // initialize the game state from here
                    const scenarioId = document.getElementById('data').dataset.scenario
                    gameState = new GameState(scenarioId)
                }
                gameState.gameId = responseData.game.game_id
                gameState.setMetrics(responseData.metrics)
                resolve(responseData);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                reject(error);
            });
        });
    }
}
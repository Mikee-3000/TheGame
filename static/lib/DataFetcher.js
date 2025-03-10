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
            // measure the time it takes, in milliseconds
            const startTime = performance.now()
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'TheGame DataFetcher/1.0' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(responseData => {
                // measure the time it takes, in milliseconds
                const endTime = performance.now()
                const elapsedTime = endTime - startTime
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
                if (!gameState.gameId) {
                    // this is only necessary on the first load.
                    gameState.gameId = responseData.game.game_id
                    // this is for the initial load
                    gameState.setMetrics(responseData.metrics)
                } else {
                    // the subsequent LLM updates need filtering for future only
                    gameState.updateMetrics(responseData)
                }
                // register the llm response time
                gameState.logLlmResponseTime(elapsedTime)
                resolve(responseData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                scope.manager.itemError(this.url)
                reject(error)
            });
        });
    }
}
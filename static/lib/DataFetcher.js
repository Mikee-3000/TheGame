import * as THREE from 'three';

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
                console.log('Loaded data:', responseData);
                resolve(responseData);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                reject(error);
            });
        });
    }
}
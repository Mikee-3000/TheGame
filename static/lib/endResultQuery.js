export default function endResultQuery(endGameData) {
    return new Promise((resolve, reject) => {
        const response = fetch('/win-lose/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...endGameData
        })
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            console.error(error)
        })
    })
}
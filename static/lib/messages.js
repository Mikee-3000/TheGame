async function setPolicy(gameData) {
  try {
    const response = await fetch('/set-policy/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...gameData
      })
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export {setPolicy}
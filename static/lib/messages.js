async function setPolicy(gameData) {
  try {
    const response = await fetch('http://127.0.0.1:8000/set-policy/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...gameData
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // TODO: Error handling
    console.error(error)
  }
}

export {setPolicy}
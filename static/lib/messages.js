async function sendMetrics(gameData) {
  try {
    const response = await fetch('http://localhost:8080/send_metrics/', {
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
    console.log(response)
    console.error(error)
  }
}

export {sendMetrics}
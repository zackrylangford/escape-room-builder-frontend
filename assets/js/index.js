
//function to get the id token from local storage and add it to the headers of the fetch request
function fetchWithAuth(url, options = {}) {
    const idToken = localStorage.getItem("IdToken");
    console.log("Retrieved Token: ", idToken);

    if (!idToken) {
        console.log("No token found. Redirecting to login.");
        window.location.href = '/login.html';
        return;
    }

    const headers = {
        'Authorization': 'Bearer ' + idToken,
        ...options.headers
    };

    const fetchOptions = { ...options, headers };
    console.log("Fetching URL with options: ", url, JSON.stringify(fetchOptions, null, 2));

    return fetch(url, fetchOptions)
        .then(response => {
            console.log("Raw Response: ", response);

            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        });
}

// Get all the items from the DynamoDB table 
document.getElementById('getAllItems').addEventListener('click', function() {
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/')
        .then(data => {
            console.log("Processed Data: ", data);
            document.getElementById('items').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error in processing response: ", error);
        });
});

// Get a single item from the DynamoDB table
document.getElementById('getItem').addEventListener('click', function() {
    const id = document.getElementById('getItemId').value;
    fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${id}`)
        .then(data => {
            document.getElementById('singleItem').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error fetching item: ", error);
        });
});

// Delete an item from the DynamoDB table
document.getElementById('deleteItem').addEventListener('click', function() {
    const id = document.getElementById('deleteItemId').value;
    fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${id}`, { method: 'DELETE' })
        .then(data => {
            alert('Item deleted');
            console.log("Delete response: ", data);
        })
        .catch(error => {
            console.error("Error deleting item: ", error);
        });
});

// Add a game to the DynamoDB table
document.getElementById('saveGame').addEventListener('click', function() {
    // Get the values from the form
    const gameTitle = document.getElementById('gameTitle').value;
    const gameDescription = document.getElementById('gameDescription').value;
    const timeLimit = document.getElementById('timeLimit').value;
    
    // Get the challenge data
    const challenges = [];
    const challengeElements = document.querySelectorAll('.challenge');
    challengeElements.forEach(challengeElement => {
        const challengeTitle = challengeElement.querySelector('.challengeTitle').value;
        const challengeDescription = challengeElement.querySelector('.challengeDescription').value;
        const challengeType = challengeElement.querySelector('.challengeType').value;
        
        // Add the challenge data to the array
        challenges.push({
            title: challengeTitle,
            description: challengeDescription,
            type: challengeType
        });
    });

    // Create a game object
    const gameData = {
        title: gameTitle,
        description: gameDescription,
        timeLimit: parseInt(timeLimit), // Convert to integer
        challenges: challenges
    };

    // Send the game data to Lambda
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
    .then(data => {
        alert('Game added successfully');
        console.log("Add game response: ", data);
    })
    .catch(error => {
        console.error("Error adding game: ", error);
    });
});


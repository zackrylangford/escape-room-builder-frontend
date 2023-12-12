import { fetchWithAuth } from './api.js';
import { setupModal, showModal, hideModal } from './modal.js';

// Retrieve and display all user-created Escape Rooms
export function displayAllGames() {
    const allGamesList = document.getElementById('allGames');

    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', {
        method: 'GET',
    })
    .then(games => {
        allGamesList.innerHTML = ''; // Clear existing content

        games.forEach(game => {
            const gameContainer = document.createElement('div');
            gameContainer.classList.add('game');
        
            const editIcon = document.createElement('span');
            editIcon.classList.add('edit-icon');
            editIcon.innerHTML = '&#9998;';
            editIcon.setAttribute('data-game-id', game.id.S);  // Store the game ID
            editIcon.addEventListener('click', function() {
                const gameId = this.getAttribute('data-game-id'); // Retrieve the game ID
                fetchGameById(gameId).then(gameData => {
                    populateEditModal(gameData, gameId); // Pass gameId to populateEditModal
                }).catch(error => {
                    console.error("Error fetching game details: ", error);
                });
            });
            gameContainer.appendChild(editIcon);
        

            // Add game details to the card
            const gameTitle = document.createElement('h3');
            gameTitle.textContent = game.GameTitle.S;
            gameContainer.appendChild(gameTitle);

            const gameDescription = document.createElement('p');
            gameDescription.textContent = game.GameDescription.S;
            gameContainer.appendChild(gameDescription);

            const timeLimit = document.createElement('p');
            timeLimit.textContent = `Time Limit: ${game.TimeLimit.N} seconds`;
            gameContainer.appendChild(timeLimit);

            // Add challenges list
            const challengesList = document.createElement('ul');
            game.Challenges.L.forEach(challenge => {
                const challengeItem = document.createElement('li');
                challengeItem.textContent = `${challenge.M.Title.S}: ${challenge.M.Description.S} (Type: ${challenge.M.Type.S})`;
                challengesList.appendChild(challengeItem);
            });
            gameContainer.appendChild(challengesList);

            allGamesList.appendChild(gameContainer);
        });
    })
    .catch(error => {
        console.error("Error fetching games: ", error);
    });
}
// Call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setupEditModal();
    displayAllGames();
});


// Give Users ability to edit their Escape Rooms
// Function to setup edit modal
export function setupEditModal() {
    setupModal('editGameModal');
}


// Function to populate the edit modal with game data
function populateEditModal(gameData, gameId) {
    console.log("Game Data: ", gameData);
    document.getElementById('editGameTitle').value = gameData.GameTitle.S;
    document.getElementById('editGameDescription').value = gameData.GameDescription.S;
    document.getElementById('editTimeLimit').value = gameData.TimeLimit.N;

    const editChallengesContainer = document.getElementById('editChallengesContainer');
    console.log("Challenges Container: ", editChallengesContainer); // Verify container existence

    editChallengesContainer.innerHTML = '';

    gameData.Challenges.L.forEach((challengeData, index) => {
        console.log("Processing Challenge: ", challengeData); // Check each challenge

        const challengeDiv = document.createElement('div');
        challengeDiv.classList.add('challenge');
        challengeDiv.setAttribute('data-challenge-index', index);

        const titleInput = createInputField('challengeTitle', challengeData.M.Title.S, index);
        const descInput = createInputField('challengeDescription', challengeData.M.Description.S, index);
        const typeInput = createInputField('challengeType', challengeData.M.Type.S, index);

        challengeDiv.appendChild(titleInput);
        challengeDiv.appendChild(descInput);
        challengeDiv.appendChild(typeInput);
        editChallengesContainer.appendChild(challengeDiv);
    });
    document.getElementById('hiddenGameId').value = gameId; 
    showModal('editGameModal');
}

// Helper function to create input fields for challenges
function createInputField(fieldName, value, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `${fieldName}[${index}]`;
    input.value = value;
    return input;
}



function fetchGameById(gameId) {
    return fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${gameId}`, {
        method: 'GET',
    });
}


document.getElementById('saveChanges').addEventListener('click', function() {
    const updatedGameData = {
        title: document.getElementById('editGameTitle').value,
        description: document.getElementById('editGameDescription').value,
        timeLimit: document.getElementById('editTimeLimit').value,
        challenges: []
    };

    const challengeDivs = document.querySelectorAll('.challenge');
    challengeDivs.forEach(challengeDiv => {
        const titleInput = challengeDiv.querySelector('[name^="challengeTitle"]');
        const descInput = challengeDiv.querySelector('[name^="challengeDescription"]');
        const typeInput = challengeDiv.querySelector('[name^="challengeType"]');

        // Only add the challenge if all inputs exist
        if (titleInput && descInput && typeInput) {
            updatedGameData.challenges.push({
                title: titleInput.value,
                description: descInput.value,
                type: typeInput.value
            });
        }
    });

    // Assuming you have the game ID stored or accessible somehow
    const gameId = document.getElementById('hiddenGameId').value;

    fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGameData)
    })
    .then(response => {
        // console.log('Full Response Object:', response); // Log the full response object
        // console.log('Response Status Code:', response.status); // Log the status code

    })
    .then(data => {
        console.log('Game updated successfully:', data); 
        hideModal('editGameModal'); // Ensure this function is defined and correctly closes the modal
        displayAllGames(); // Refresh the list of games
    })
    .catch(error => {
        console.error("Error updating game: ", error);
    });
});

// Event listener for "Delete Game" button
document.querySelector('.delete-icon').addEventListener('click', function() {
    const gameId = document.getElementById('hiddenGameId').value;
    if (gameId && confirm("Are you sure you want to delete this game?")) {
        fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${gameId}`, {
            method: 'DELETE',
        })
        // .then(response => response.json()) // Directly parse the JSON without checking response.ok
        .then(data => {
            alert('Game deleted successfully.');
            hideModal('editGameModal');
            displayAllGames(); // Refresh the list of games
        })
        .catch(error => {
            console.error("Error deleting game: ", error);
            alert("There was an error deleting the game.");
        });
    }
});


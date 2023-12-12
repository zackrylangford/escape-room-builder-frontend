import { fetchWithAuth } from './api.js';
import { setupModal, showModal } from './modal.js';

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
            editIcon.addEventListener('click', function() {
                fetchGameById(game.id.S).then(gameData => {
                    populateEditModal(gameData);
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
function populateEditModal(gameData) {
    console.log("Game Data: ", gameData); // Check the received game data

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



// Placeholder for function to handle Save Changes in Edit Modal
document.getElementById('saveChanges').addEventListener('click', function() {
    const updatedGameData = {
        title: document.getElementById('editGameTitle').value,
        description: document.getElementById('editGameDescription').value,
        timeLimit: document.getElementById('editTimeLimit').value,
        challenges: Array.from(document.querySelectorAll('.challenge')).map(challengeDiv => {
            return {
                title: challengeDiv.querySelector('[name^="challengeTitle"]').value,
                description: challengeDiv.querySelector('[name^="challengeDescription"]').value,
                type: challengeDiv.querySelector('[name^="challengeType"]').value
            };
        })
    };

    console.log('Updated Game Data:', updatedGameData);
    // TODO: API call to update the game data

    showModal('editGameModal'); // Hide modal after saving
});

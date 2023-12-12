import { fetchWithAuth } from './api.js';

// Function to fetch and display all games
export function displayAllGames() {
    const allGamesList = document.getElementById('allGames');

    // Fetch all games from the database
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', {
        method: 'GET',
    })
    .then(games => {
        allGamesList.innerHTML = ''; // Clear existing content

        games.forEach(game => {
            const gameContainer = document.createElement('div');
            gameContainer.classList.add('game');
        
            // Create and append the edit icon to the game container
            const editIcon = document.createElement('span');
            editIcon.classList.add('edit-icon');
            editIcon.innerHTML = '&#9998;'; // Unicode for a pencil icon
            editIcon.addEventListener('click', function() {
                // TODO: Handle edit click
                console.log('Edit icon clicked for game:', game.GameTitle.S);
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

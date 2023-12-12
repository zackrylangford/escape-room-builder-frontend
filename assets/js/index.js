// Import the showModal and setupModal functions from modal.js
import { showModal, setupModal } from './modal.js';


// Call to display all user created games when the page initially loads
displayAllGames();

// Call to setup the challenge dropdown when the page initially loads
populateChallengeDropdown();


// Add event listener to "Create New Escape Room" button to open the modal
document.addEventListener('DOMContentLoaded', function() {
    // Setup for 'Create New Escape Room' modal
    setupModal('createFormModal', 'closeModal');

    // Event listener to open 'Create New Escape Room' modal
    document.getElementById('openModalButton').addEventListener('click', function() {
        showModal('createFormModal');
    });
});




// Function to fetch the list of challenges from your /challenges API endpoint
function fetchChallenges() {
    return fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/challenges', {
        method: 'GET',
    });
}

// Function to populate the challenge dropdown
function populateChallengeDropdown() {
    const challengeTypeSelects = document.querySelectorAll('.challengeType');

    fetchChallenges()
        .then(challenges => {
            // Assuming the API returns an array of challenge objects with id and Description attributes
            challenges.forEach(challenge => {
                challengeTypeSelects.forEach(select => {
                    const option = document.createElement('option');
                    option.value = challenge.id; // Use id as the value
                    option.text = challenge.id; // Use id as text as well
                    select.appendChild(option);
                });
            });
        })
        .catch(error => {
            console.error("Error fetching challenges: ", error);
        });
}

// Add event listener to "Add Challenge" button to create a new challenge input form
document.getElementById('addChallenge').addEventListener('click', function() {
    console.log("Adding challenge button clicked");
    createChallengeInput();
});

// After the DOM is fully loaded add the event listener to the "Remove Challenge" button
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.removeChallenge').forEach(function(button) {
        button.addEventListener('click', function(event) {
            const challenge = event.target.closest('.challenge');
            challenge.parentNode.removeChild(challenge);
        });
    });
});

// Function to populate the challenge type select element
function populateChallengeTypeSelect(challengeTypeSelect) {
    fetchChallenges()
        .then(challenges => {
            challenges.forEach(challenge => {
                const option = document.createElement('option');
                option.value = challenge.id;
                option.text = challenge.id; // Use the Description attribute
                challengeTypeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching challenges: ", error);
        });
}

// Function to create a new challenge input form
function createChallengeInput() {
    const challengeContainer = document.getElementById('challengesContainer');
    const newChallenge = document.createElement('div');
    const removeChallengeButton = document.createElement('button');
    removeChallengeButton.textContent = 'Remove Challenge';
    removeChallengeButton.type = 'button'; // Make sure it doesn't submit the form
    removeChallengeButton.classList.add('removeChallenge');
    removeChallengeButton.onclick = function() {
        challengeContainer.removeChild(newChallenge);
    };

    
    newChallenge.classList.add('challenge');

    // Create labels and input elements for challenge title, description, and type
    const challengeTitleLabel = document.createElement('label');
    challengeTitleLabel.textContent = 'Challenge Title:';
    challengeTitleLabel.setAttribute('for', 'challengeTitle');

    const challengeTitleInput = document.createElement('input');
    challengeTitleInput.type = 'text';
    challengeTitleInput.classList.add('challengeTitle');
    challengeTitleInput.placeholder = 'Enter Challenge Title';

    const challengeDescriptionLabel = document.createElement('label');
    challengeDescriptionLabel.textContent = 'Challenge Description:';
    challengeDescriptionLabel.setAttribute('for', 'challengeDescription');

    const challengeDescriptionTextarea = document.createElement('textarea');
    challengeDescriptionTextarea.classList.add('challengeDescription');
    challengeDescriptionTextarea.placeholder = 'Enter Challenge Description';

    const challengeTypeLabel = document.createElement('label');
    challengeTypeLabel.textContent = 'Challenge Type:';
    challengeTypeLabel.setAttribute('for', 'challengeType');

    const challengeTypeSelect = document.createElement('select');
    challengeTypeSelect.classList.add('challengeType');
    populateChallengeTypeSelect(challengeTypeSelect); // Populate the select element

    // Append the labels and input elements to the newChallenge div
    newChallenge.appendChild(challengeTitleLabel);
    newChallenge.appendChild(challengeTitleInput);
    newChallenge.appendChild(document.createElement('br'));

    newChallenge.appendChild(challengeDescriptionLabel);
    newChallenge.appendChild(challengeDescriptionTextarea);
    newChallenge.appendChild(document.createElement('br'));

    newChallenge.appendChild(challengeTypeLabel);
    newChallenge.appendChild(challengeTypeSelect);
    newChallenge.appendChild(removeChallengeButton);

    challengeContainer.appendChild(newChallenge);
    
}


// Add event listener to "Save Game" button
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

    // Send the game data to the specified API endpoint (replace '/your-api-endpoint' with the actual endpoint)
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
        .then(data => {
            alert('Game added successfully');
            resetForm(); // Reset the form and challenges
            
            console.log("Add game response: ", data);
            
            // Display all games after resetting the form
            displayAllGames();
        })
        .catch(error => {
            console.error("Error adding game: ", error);
        });

    document.getElementById('createFormModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
});


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


// Function to reset the form and challenges after a game is successfully added
function resetForm() {
    // Reset the main game form
    document.getElementById('gameTitle').value = '';
    document.getElementById('gameDescription').value = '';
    document.getElementById('timeLimit').value = '';

    // Remove all challenge forms except the first one
    const challengeContainer = document.getElementById('challengesContainer');
    const challengeForms = challengeContainer.querySelectorAll('.challenge');
    for (let i = 1; i < challengeForms.length; i++) {
        challengeContainer.removeChild(challengeForms[i]);
    }
}

// Function to fetch and display all games
function displayAllGames() {
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


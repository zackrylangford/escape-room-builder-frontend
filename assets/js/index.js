// Call to setup the challenge dropdown when the page initially loads
populateChallengeDropdown();

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

    challengeContainer.appendChild(newChallenge);
}

// Add event listener to "Save Game" button to save the game data to the specified API endpoint
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
            console.log("Add game response: ", data);
        })
        .catch(error => {
            console.error("Error adding game: ", error);
        });
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
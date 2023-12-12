import { fetchChallenges } from './api.js';

// Function to populate the challenge dropdown
export function populateChallengeDropdown() {
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

// Function to populate the challenge type select element
export function populateChallengeTypeSelect(challengeTypeSelect) {
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
export function createChallengeInput() {
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

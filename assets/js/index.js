// Imports from modularized JavaScript files
import { showModal, setupModal } from './modal.js';
import { populateChallengeDropdown, createChallengeInput, populateChallengeTypeSelect } from './challengeManager.js';
import { displayAllGames } from './gameManager.js';
import { resetForm } from './formUtilities.js';
import { fetchWithAuth } from './api.js';

// Setup for the modal and initializations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup for 'Create New Escape Room' modal
    setupModal('createFormModal', 'closeModal');

    // Populate challenge dropdown on page load
    populateChallengeDropdown();

    // Display all user-created games on page load
    displayAllGames();

    // Event listener to open the 'Create New Escape Room' modal
    document.getElementById('openModalButton').addEventListener('click', function() {
        showModal('createFormModal');
    });

    // Event listener for "Add Challenge" button
    document.getElementById('addChallenge').addEventListener('click', createChallengeInput);

    // Event listeners for dynamically added "Remove Challenge" buttons
    // This might need to be adjusted based on how and when challenges are added
    document.querySelectorAll('.removeChallenge').forEach(function(button) {
        button.addEventListener('click', function(event) {
            const challenge = event.target.closest('.challenge');
            challenge.parentNode.removeChild(challenge);
        });
    });

    // Event listener for "Save Game" button
    document.getElementById('saveGame').addEventListener('click', function() {
        // Logic to gather form data and prepare the game object
        const gameTitle = document.getElementById('gameTitle').value;
        const gameDescription = document.getElementById('gameDescription').value;
        const timeLimit = document.getElementById('timeLimit').value;
        const challenges = Array.from(document.querySelectorAll('.challenge')).map(challengeElement => {
            return {
                title: challengeElement.querySelector('.challengeTitle').value,
                description: challengeElement.querySelector('.challengeDescription').value,
                type: challengeElement.querySelector('.challengeType').value
            };
        });

        // Create the game object
        const gameData = {
            title: gameTitle,
            description: gameDescription,
            timeLimit: parseInt(timeLimit),
            challenges: challenges
        };

        // Sending the game data to the API
        fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        })
            .then(data => {
                alert('Game added successfully');
                resetForm();
                displayAllGames();
            })
            .catch(error => {
                console.error("Error adding game: ", error);
            });

        // Close the modal after saving the game
        document.getElementById('createFormModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
    });
});

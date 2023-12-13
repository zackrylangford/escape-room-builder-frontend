// Imports from modularized JavaScript files
import { showModal, setupModal, hideModal } from './modal.js';
import { populateChallengeDropdown, createChallengeInput } from './challengeManager.js';
import { displayAllGames } from './gameManager.js';
import { resetForm } from './formUtilities.js';
import { fetchWithAuth } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Setup for modals
    setupModal('createFormModal');
    // If you have other modals, set them up here as well

    // Display all user-created games
    displayAllGames();

    // Populate challenge dropdown
    populateChallengeDropdown();

    // Event listener to open 'Create New Escape Room' modal
    document.getElementById('openModalButton').addEventListener('click', function() {
        showModal('createFormModal');
    });

    // Event listener for "Add Challenge" button
    document.getElementById('addChallenge').addEventListener('click', createChallengeInput);

    // Logic for handling dynamically added "Remove Challenge" buttons
    // This should be revisited to ensure it works with dynamically added challenges
    document.querySelectorAll('.removeChallenge').forEach(function(button) {
        button.addEventListener('click', function(event) {
            const challenge = event.target.closest('.challenge');
            challenge.parentNode.removeChild(challenge);
        });
    });

    // Event listener for "Save Game" button
    document.getElementById('saveGame').addEventListener('click', function() {
        const gameTitle = document.getElementById('gameTitle').value;
        const gameDescription = document.getElementById('gameDescription').value;
        const timeLimit = document.getElementById('timeLimit').value;
        const challenges = Array.from(document.querySelectorAll('.challenge')).map(challengeElement => {
            console.log(challengeElement); // Log the challenge element to inspect its structure
            return {
                title: challengeElement.querySelector('.challengeTitle').value,
                description: challengeElement.querySelector('.challengeDescription').value,
                type: challengeElement.querySelector('.challengeType').value
            };
        });
        

        const gameData = {
            title: gameTitle,
            description: gameDescription,
            timeLimit: parseInt(timeLimit),
            challenges: challenges
        };

        fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        })
        .then(data => {
            alert('Game added successfully');
            resetCreateGameForm();  // Reset the form fields and challenges
            displayAllGames();      // Refresh the displayed games
            hideModal('createFormModal');  // Close the modal
        })
        .catch(error => {
            console.error("Error adding game: ", error);
        });
    });

    function resetCreateGameForm() {
        // Reset input fields
        document.getElementById('gameTitle').value = '';
        document.getElementById('gameDescription').value = '';
        document.getElementById('timeLimit').value = '';
    
        // Clear dynamically added challenges
        const challengesContainer = document.getElementById('challengesContainer');
        challengesContainer.innerHTML = '';
    
        // Optionally, add back a default/initial challenge form if needed
        // createChallengeInput(); // Uncomment if you want an initial empty challenge form
    }

});

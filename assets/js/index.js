// Imports from modularized JavaScript files
import { showModal, setupModal } from './modal.js';
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
            resetForm();
            displayAllGames();
        })
        .catch(error => {
            console.error("Error adding game: ", error);
        });

        // Hide modal after saving the game
        showModal('createFormModal');
    });
});

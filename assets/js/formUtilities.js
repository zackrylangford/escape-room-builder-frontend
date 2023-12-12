// Function to reset the form and challenges after a game is successfully added
export function resetForm() {
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
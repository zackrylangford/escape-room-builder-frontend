document.addEventListener('DOMContentLoaded', function() {
    fetchGames();
});

function fetchGames() {
    fetch('https://4mqvypnc0d.execute-api.us-east-1.amazonaws.com/v1/games')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched games:', data); // Log fetched data
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
}

function populateTable(games) {
    const tableBody = document.getElementById('gamesTableBody');
    tableBody.innerHTML = ''; // Clear existing table data

    games.forEach(game => {
        let row = tableBody.insertRow();
        row.setAttribute('data-game-id', game.game_id); // Set the data-game-id attribute

        let gameIdCell = row.insertCell(0);
        gameIdCell.textContent = game.game_id;

        let descriptionCell = row.insertCell(1);
        descriptionCell.textContent = game.description || 'No description available';

        let editCell = row.insertCell(2); // New cell for edit button
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function() { editGame(game.game_id); };
        editCell.appendChild(editButton);
        let deleteCell = row.insertCell(3); // New cell for delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() { deleteGame(game.game_id, row); };
        deleteCell.appendChild(deleteButton);
    });
}

function editGame(game_id) {
    const row = document.querySelector(`tr[data-game-id='${game_id}']`);
    const descriptionCell = row.cells[1];
    const currentDescription = descriptionCell.textContent;

    descriptionCell.innerHTML = `<input type="text" value="${currentDescription}">`;

    const editButton = row.cells[2].querySelector('button');
    editButton.textContent = 'Save';
    editButton.onclick = function() { saveGame(game_id); };
}

function saveGame(gameId) {
    const row = document.querySelector(`tr[data-game-id='${game_id}']`);
    const newDescription = row.cells[1].querySelector('input').value;

    console.log('Saving game:', { gameId, newDescription }); // Log the data being saved

    sendNewDescription(game_id, newDescription)
        .then(() => {
            row.cells[1].textContent = newDescription;
            const editButton = row.cells[2].querySelector('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() { editGame(game_id); };
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function sendNewDescription(gameId, newDescription) {
    const url = `https://4mqvypnc0d.execute-api.us-east-1.amazonaws.com/v1/games/${game_id}`;
    const body = JSON.stringify({
        description: newDescription
    });

    console.log('Sending PUT request with body:', body);

    return fetch(url, {
        method: 'PUT',  // Change to PUT for update operations
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error updating game:', error);
    });
}

function deleteGame(gameId, row) {
const url = `https://4mqvypnc0d.execute-api.us-east-1.amazonaws.com/v1/games/${gameId}`;
console.log('Sending DELETE request for game:', gameId);


    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Game deleted successfully:', gameId);
        row.remove(); // Remove the game's row from the table
    })
    .catch(error => {
        console.error('Error deleting game:', error);
    });
}
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

document.getElementById('getAllItems').addEventListener('click', function() {
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/')
        .then(data => {
            console.log("Processed Data: ", data);
            document.getElementById('items').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error in processing response: ", error);
        });
});

document.getElementById('getItem').addEventListener('click', function() {
    const id = document.getElementById('getItemId').value;
    fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${id}`)
        .then(data => {
            document.getElementById('singleItem').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error("Error fetching item: ", error);
        });
});

document.getElementById('deleteItem').addEventListener('click', function() {
    const id = document.getElementById('deleteItemId').value;
    fetchWithAuth(`https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/${id}`, { method: 'DELETE' })
        .then(data => {
            alert('Item deleted');
            console.log("Delete response: ", data);
        })
        .catch(error => {
            console.error("Error deleting item: ", error);
        });
});

document.getElementById('addItem').addEventListener('click', function() {
    const id = document.getElementById('newItemId').value;
    const name = document.getElementById('newItemName').value;
    fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name })
    })
        .then(data => {
            alert('Item added');
            console.log("Add response: ", data);
        })
        .catch(error => {
            console.error("Error adding item: ", error);
        });
});

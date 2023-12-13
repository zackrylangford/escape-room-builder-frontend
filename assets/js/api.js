//function to get the id token from local storage and add it to the headers of the fetch request
export function fetchWithAuth(url, options = {}) {
    const idToken = localStorage.getItem("IdToken");
    //console.log("Retrieved Token: ", idToken);

    if (!idToken) {
        //console.log("No token found. Redirecting to login.");
        window.location.href = '/login.html';
        return;
    }

    const headers = {
        'Authorization': 'Bearer ' + idToken,
        ...options.headers
    };

    const fetchOptions = { ...options, headers };
    //console.log("Fetching URL with options: ", url, JSON.stringify(fetchOptions, null, 2));

    return fetch(url, fetchOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.headers.get('content-type')?.includes('application/json') 
               ? response.json() 
               : response.text();
    });

}


// Function to fetch the list of challenges from your /challenges API endpoint
export function fetchChallenges() {
    return fetchWithAuth('https://sfw4prb6a8.execute-api.us-east-1.amazonaws.com/Prod/challenges', {
        method: 'GET',
    });
}


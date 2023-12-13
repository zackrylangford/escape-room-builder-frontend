// Initialize the Amazon Cognito region
AWS.config.region = 'us-east-1'; // Set your region

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var authenticationData = {
        Username: username,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId: 'us-east-1_QvBKb4ybY', 
        ClientId: '3s8kvqrh0k0t76suk1vl11q1do'
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log("Authentication successful!");
        var accessToken = result.getAccessToken().getJwtToken();
        var idToken = result.getIdToken().getJwtToken();
    
        console.log("Access Token: ", accessToken);
        console.log("ID Token: ", idToken);

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : 'us-east-1:01a4d3ad-81cf-447b-9498-a74a4312a8c8',
                Logins : {
                    'cognito-idp.us-east-1.amazonaws.com/us-east-1_QvBKb4ybY' : result.getIdToken().getJwtToken()
                }
            });

            // Refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
              if (error) {
                  console.error("Error refreshing credentials: ", error);
              } else {
                  console.log('Credentials successfully refreshed!');
                  console.log('Cognito Identity ID:', AWS.config.credentials.identityId);
                    // Store the session tokens in local storage
                    localStorage.setItem("CognitoIdentityId", AWS.config.credentials.identityId);
                    localStorage.setItem("IdToken", result.getIdToken().getJwtToken());
                    window.location.href = 'index.html'; // Redirect to success page after refreshing credentials
                }
            });
        },

        onFailure: function (err) {
            // User authentication was not successful
            console.error("Authentication error:", err);
            alert(err.message || JSON.stringify(err));
        },

        newPasswordRequired: function (userAttributes, requiredAttributes) {
          console.log("New password required!");
            // User was signed up by an admin and must provide new password and required attributes, if any, to complete authentication

            // Ask the user for the new password
            var newPassword = prompt("You are logged in! Please set a new password for future logins.");

            // Check if the new password meets your password policy
            if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
                alert("Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter.");
                return;
            }

            var attributeData = {};

            cognitoUser.completeNewPasswordChallenge(newPassword, attributeData, this);
        }
    });
});

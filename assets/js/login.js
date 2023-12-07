
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
    UserPoolId: 'us-east-1_lf6jSzSlE', 
    ClientId: '6bqb321n48lbh7ca7s95t21k0d'
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username: username,
    Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      // User authentication was successful
      var accessToken = result.getAccessToken().getJwtToken();

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : 'us-east-1:8e30416f-dc26-4543-abab-db8622ccc8ec',
        Logins : {
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_lf6jSzSlE' : result.getIdToken().getJwtToken()
        }
      });

      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      AWS.config.credentials.refresh((error) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Successfully logged!');
          //store the session tokens in local storage
          localStorage.setItem("CognitoIdentityId", AWS.config.credentials.identityId);
          localStorage.setItem("IdToken", result.getIdToken().getJwtToken());
          window.location.href = 'index.html'; // Redirect to success page after refreshing credentials
        }
      });
    },

    onFailure: function (err) {
      // User authentication was not successful
      alert(err.message || JSON.stringify(err));
    },

    newPasswordRequired: function (userAttributes, requiredAttributes) {
      // User was signed up by an admin and must provide new 
      // password and required attributes, if any, to complete 
      // authentication.

      // TODO: Ask the user for the new password
      var newPassword = prompt("You are logged in! Please set a new password for future logins.");

      // Check if the new password meets your password policy
      // This is a simple example and may not cover all your policy's requirements
      if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
        alert("Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter.");
        return;
      }

      // TODO: Fill in the required attribute data
      var attributeData = {};

      cognitoUser.completeNewPasswordChallenge(newPassword, attributeData, this);
    }
  });

});
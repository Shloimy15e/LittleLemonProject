const loginSubmit = document.getElementById('login-submit');
const errorMessage = document.getElementById('error-message');

loginSubmit.addEventListener('click', async function(event) {
      event.preventDefault();
      try {
            // Get the username and password from the form
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            // Validate the input
            validateInput(username, password);
            // Log in the user and get the token
            const token = await login(username, password);
            // Fetch the user data using the token
            const user = await fetchUser(token);
            // Store the user data in localStorage
            storeUserData(user, token);
            // Redirect the user to the home page
            window.location.href = '/';
      } catch (error) {
            // If an error occurred display an error message
            errorMessage.textContent = getErrorMessage(error);
            console.error('Error:', error);
      } finally {
            // re-enable the login button
            loginSubmit.disabled = false;
      }
});   

function getCsrfToken() {
      return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function validateInput(username, password){
      if (username === '') { throw new Error('Please enter a username'); }
      if (password === '') { throw new Error('Please enter a password'); }
}

async function fetchUser(token) {
      const response = await fetch('/auth/users/me/', {
            headers: {
                  'content-type': 'application/json',
                  'Authorization': 'Token ' + token
            }
      });
      if (!response.ok) {
            throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
      }     
      return response.json();
}

async function login(username, password) {            
      // If all data was entered create a loginData object
      const loginData = { username, password };
      csrfToken = getCsrfToken();
      // Disable the login button to prevent multiple login requests
      loginSubmit.disabled = true;

      // log in the user using the djoser API
      const response = await fetch('/auth/token/login/', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(loginData)
      })
      if (!response.ok) throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
      
      // Get the token from the response
      const data = await response.json();
      // Return the token
      return data.auth_token;
}

function getErrorMessage(error) {
      // Get the error message from the error object and return user friendly error message
      return error.message;
}
      

function storeUserData(user, token) {
      // Get the user data and store it in localStorage 
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
}

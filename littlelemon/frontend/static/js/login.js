const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');

loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      login();    
});   

function getCsrfToken() {
      return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

function login() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const csrfToken = getCsrfToken();

      // Check if the user entered all required data
      if (username === '' && password !== '') {
            errorMessage.textContent = 'Please enter a username';
            return;
      } else if (username !== '' && password === '') {
            errorMessage.textContent = 'Please enter a password';
            return;
      } else if (username === '' && password === '') {
            errorMessage.textContent = 'Please enter a username and password';
            return;
      }
            
      // If all data was entered create a loginData object
      const loginData = {
            username: username,
            password: password
      };
      loginButton.disabled = true;

      // log in the user using the djoser API
      fetch('/auth/token/login/', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(loginData)
      })
      .then(response => {
            if (!response.ok) {
                  response.json().then(data => {
                        errorMessage.textContent = 'error occurred ';
                        console.error('Error:', data);
                  });
                  errorMessage.textContent = 'error occurred ' + response.status;
                  throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
      })
      .then(data => {
            // Save the token in local storage
            localStorage.setItem('token', data.auth_token);
            window.location.href = '/';
      })
      .catch(error => {
            // Display error message
            errorMessage.textContent = 'login failed. Please check your info and try again. error: ' + response.body;
            console.error('Error:', error);
      })
      .finally(() => {
            // re-enable the login button
            loginButton.disabled = false;
      });
}

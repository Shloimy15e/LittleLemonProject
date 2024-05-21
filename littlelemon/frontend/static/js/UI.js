window.onload = function() {
      // Get elements that will be changed according to user data
      const loginButton = document.getElementById('login-button');
      const logoutButton = document.getElementById('logout-button');

      if (localStorage.getItem('token') === null && localStorage.getItem('user') === null) {
            // When user is not logged in show login button and hide logout button
            loginButton.style.display = 'block';
            logoutButton.style.display = 'none';
      } else {
            // When user is logged in show logout button and hide login button
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
      }
}
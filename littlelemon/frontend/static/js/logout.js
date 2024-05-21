const logoutButton = document.getElementById('logout-button');
const url = logoutButton.dataset.url;
// When logout button is clicked, call the logout function
logoutButton.addEventListener('click', logout);

// Function that logs out the user by making api call to the djoser logout endpoint
async function logout() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!user || !token) {
            console.log('User is not logged in');
            return;
      }
      
      try {
            const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + token
                  }
            });
            if (!response.ok) {
                  throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload();
      } catch (error) {
            console.error('Error:', error);
            if (token||user) {
                  alert('An error occurred while logging you out, please try again');
            }      
      };
}

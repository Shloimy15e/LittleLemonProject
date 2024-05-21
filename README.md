# Little Lemon Project 
<h2> Capstone project</h2>

The app has a backend and frontend please be aware that the frontend functionality is extra and is not needed according to project requirements.
Feel free to play around with the front end just make sure to create a user first by using the djoser api as I will show soon.

<h3>Api list:</h3>
There are the api endpoints that are made by me and there are djoser auth/ endpoints provided by the djoser library
<ul>
  <h4><ins>My API endpoints:</ins></h4>
  <h4>Menu view api: POST PUT PATCH and DELETE require admin token GEt requires no authentication</h4>
  <li>api/menu/ POST GET </li>
  <li>api/menu/{menuId}/ GET PUT PATCH DELETE</li>
  <h4>Bookings view api: requires authentication</h4>
  <li>api/bookings/ POST GET</li>
  <li>api/bookings/{bookingId}/ GET PUT PATCH DELETE</li>
  <h4><ins>Djoser API endpoints</ins></h4>
  <li>auth/users/ POST for registration (signing up) GET requires authentication when requested by admin token returns all users and when by regular user returns user info </li>
  <li>auth/users/{userId}/ GET DELETE PUT PATCH when used by admin can be used on any user ID and when used by user it can be used with users own id only and acts like users/me/ </li>
  <li>auth/users/me/ requires authentication GET PUT PATCH DELETE</li>
  <li>auth/token/login/ POST takes username and password and returns token</li>
  <li>auth/token/logout/ takes token and expires token and it cannot be used anymore</li>
</ul>
<footer>Thank you again for your time please notice that I use appending slashes (=endpoint/)</footer>

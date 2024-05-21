const bookings = document.getElementById('bookings');
const bookingHeading = document.getElementById('bookings-heading');

// Import the formatTime function
import {formatTime} from './utils.js';

// Fetch all bookings. Expected response is an array of bookings objects. Anonymous data of other users and full data of the logged in user.
async function fetchBookings(token) {
      const response = await fetch('/api/bookings/', {
            headers: {
                  'content-type': 'application/json',
                  'Authorization': 'Token '  + token
            }
      });
      if (!response.ok) {
            throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
      }
      return response.json();
}

// Function to create a card for a booking
async function createBookingsCard(){
      // Create the elements for the card
      const divCard = document.createElement('div');
      const divCardBody = document.createElement('div');
      const cardBodyH2 = document.createElement('h2');
      const dateParagraph = document.createElement('p');
      const timeParagraph = document.createElement('p');
      const emailParagraph = document.createElement('p');
      const phoneParagraph = document.createElement('p');
      const noOfGuestsParagraph = document.createElement('p');
      const messageParagraph = document.createElement('p');
      // Add classes to the elements
      const elements = [dateParagraph, timeParagraph, emailParagraph, phoneParagraph, noOfGuestsParagraph, messageParagraph];
      elements.forEach(element => {
            element.className = 'card-text';
      });
      cardBodyH2.className = 'card-title';
      divCardBody.className = 'card-body';
      divCard.className = 'card row';
      // Append the elements to the card
      bookings.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(cardBodyH2);
      divCardBody.appendChild(dateParagraph);
      divCardBody.appendChild(timeParagraph);
      divCardBody.appendChild(emailParagraph);
      divCardBody.appendChild(phoneParagraph);
      divCardBody.appendChild(noOfGuestsParagraph);
      divCardBody.appendChild(messageParagraph);
      return {
            cardBodyH2,
            dateParagraph,
            timeParagraph,
            emailParagraph,
            phoneParagraph,
            noOfGuestsParagraph,
            messageParagraph
      }
}

// Display all bookings by the logged in user
async function displayBookings() {
      if (!localStorage.getItem('token')) {
            bookingHeading.textContent = 'You need to login to view your bookings';
            return;
      }
      let localToken = localStorage.getItem('token');
      try {
            const data = await fetchBookings(localToken);
            bookingHeading.textContent = 'Your Bookings';
            if (data.length === 0) {
                  bookingHeading.textContent = 'No bookings yet. Book a slot now!';
                  console.log('No bookings yet');
            } else {
                  console.log('Bookings found: ' + data.length);
                  // Check if the user is logged in
                  if (!localStorage.getItem('user')) {
                        throw new Error('User not found in localStorage');
                  }
                  // Get the user data from localStorage
                  const user = JSON.parse(localStorage.getItem('user'));
                  console.log('user id: ' + user.id);
                  // Loop through the bookings
                  data.forEach(async booking => {
                        // Only display bookings by this user
                        if(booking.user === user.id){
                              try {
                                    // Create a card for each booking
                                    const card = await createBookingsCard();
                                    console.log('Booking: ' + JSON.stringify(booking));
                                    card.cardBodyH2.textContent = booking.name;
                                    card.dateParagraph.textContent = 'Date: ' + booking.date;
                                    card.timeParagraph.textContent = 'Time: ' + formatTime(booking.time);
                                    card.emailParagraph.textContent = 'Email: ' + booking.email;
                                    card.noOfGuestsParagraph.textContent = 'Number of guests: ' + booking.number_of_people;
                                    // Check if the phone and message are provided
                                    if (booking.phone == null) {
                                          card.phoneParagraph.textContent = 'Phone: Not provided';
                                    } else {
                                          card.phoneParagraph.textContent = 'Phone: ' + booking.phone;
                                    }
                                          if (booking.message == null) {
                                          card.messageParagraph.textContent = 'Message: No message';
                                    } else {
                                          card.messageParagraph.textContent = 'Message: ' + booking.message;                              
                                    }
                              } catch (error) {
                                    console.error('Error in creating card: ' + error);
                              }
                        }
                  });
            }
      } catch (error) {
            // Log the error
            console.error('error in display: ' + error);
      }
}

// Call the display bookings function
displayBookings();
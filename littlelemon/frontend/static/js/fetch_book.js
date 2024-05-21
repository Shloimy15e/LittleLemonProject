const date = document.querySelector('#date');
const reservationDate = document.querySelector('#reservation_date');
const reserveButton = document.querySelector('#reserve-button');
const bookingHeading = document.querySelector('#booking-heading');
const bookings = document.querySelector('#bookings');
const reservationSlot = document.querySelector('#reservation_slot');
const loginUrl = bookingHeading.dataset.loginUrl;

reservationDate.addEventListener('change', getBookings);
reserveButton.addEventListener('click', reserve);

// Define the format time function
import {formatTime} from './utils.js';

window.onload = function() {
      const token = localStorage.getItem('token');
      if (token === null) {
            bookingHeading.innerHTML = `Please <a href="${loginUrl}">log in</a> to make a reservation`;
      } else {
            bookingHeading.textContent = 'Please select a date to see available time slots';
      }
}
async function fetchBookings(date) {
      const response = await fetch('/api/bookings?date=' + date, {
            headers: {
                  'Authorization': 'Token ' + localStorage.getItem('token')
            }
      });
      if (!response.ok) {
            throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
            // Display error message
      }
      return response.json();
}

async function postBooking(booking) {
      const response = await fetch('/api/bookings/', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Token ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(booking)
      });
      if (!response.ok) {
            throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
      }
      return response.json();
}



// Define the get bookings function
async function getBookings(){
      try {
            // Get the date the user selected
            const selectedDate = reservationDate.value;
            // Fetch the bookings for the selected date
            let data = await fetchBookings(selectedDate);
            // Clear the bookings elements
            bookingHeading.innerHTML = 'These time slots are taken <br>' + selectedDate;
            bookings.innerHTML = '';

            let timeSlots = [];
            // If there are no bookings say no bookings
            if (data.length === 0) {
                  bookingHeading.textContent = 'No bookings for this date. You can be the first!';
            }else{
                  data.forEach(booking => {
                        // Create a new elements for name and time
                        const divCard = document.createElement('div');
                        const divCardBody = document.createElement('div');
                        const cardH3 = document.createElement('h3');
                        const cardP = document.createElement('p');
                        // Add classes to the elements
                        divCard.className = 'card row';
                        divCardBody.className = 'card-body';
                        cardH3.className = 'card-title';
                        cardP.className = 'card-text';
                        // Append the elements to the card
                        bookings.appendChild(divCard);
                        divCard.appendChild(divCardBody);
                        divCardBody.appendChild(cardH3);
                        divCardBody.appendChild(cardP);
                        // If the booking has a name, set the text of the h2 element to the name of the booking
                        if (booking.name) {
                              cardH3.innerHTML = 'For: ' + booking.name + '<br>Booked by you';
                        }
                        // Set the text of the cardP element to the time of the booking
                        cardP.textContent = formatTime(booking.time);
                        // Add the time to the time slots array
                        timeSlots.push(formatTime(booking.time));
                  });
            }
            // If everything is successful, then add time slots which are not booked
            let slot_options = '';
            // Loop through the bookings returned from the API and see if the time slot is booked
            for(let i = 9; i <  23; i += 0.5){
                  const formattedTime = formatTime(i);
                  if(timeSlots.includes(formattedTime)){
                        slot_options +=  `<option value="${formattedTime}" disabled>${formattedTime}</option>`
                  }else{
                        slot_options += `<option value="${formattedTime}">${formattedTime}</option>`
                  }
            }      
            reservationSlot.innerHTML = slot_options;     
      }
      catch(error) {
            console.error('There has been a problem with your fetch operation:', error);
            //display error message
            if (localStorage.getItem('token') === null) {
                  bookingHeading.textContent += ' Please log in to view bookings';
            } else {
      }     }
}

async function reserve(){
      try {
            // Get the date the user selected
            const selectedDate = reservationDate.value;
            const selectedTime = reservationSlot.value;
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const numberOfGuests = document.querySelector('#number_of_guests').value;
            const booking = {
                  name: name,
                  email: email,
                  date: selectedDate,
                  time: selectedTime,
                  number_of_people: numberOfGuests
            }
            // Post the booking
            await postBooking(booking);
            
            getBookings();
      }
      catch(error) {
            console.error('There has been a problem with your fetch operation:', error);
            //display error message
            bookingHeading.textContent += ' An error occurred while reserving your booking';
      }
}
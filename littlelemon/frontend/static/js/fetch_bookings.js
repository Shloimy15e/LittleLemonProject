const date = document.querySelector('#date');
const reservationDate = document.querySelector('#reservation_date');
const reserveButton = document.querySelector('#reserve-button');
const bookingHeading = document.querySelector('#booking-heading');
const bookings = document.querySelector('#bookings');
const reservationSlot = document.querySelector('#reservation_slot');

reservationDate.addEventListener('change', getBookings);
reserveButton.addEventListener('click', reserve);
// Define the format time function
function formatTime(time) {
      if (typeof time === 'string') {
            // If time is a string, assume it's in the format "HH:MM:SS" and return "HH:MM"
            return time.substr(0, 5);
      } else if (typeof time === 'number') {
            // If time is a number, assume it's hours and convert to "HH:MM"
            const date = new Date(0);
            date.setSeconds(time * 3600); // convert hours to seconds
            return date.toISOString().substr(11, 5);
      } else {
            throw new Error('Invalid time format');
      }
} 

// Define the get bookings function
function getBookings(){
      // Get the date the user selected
      const selectedDate = reservationDate.value;
      // Fetch the bookings for the selected date
      fetch('/api/bookings?date=' + selectedDate)
      .then(response => {
            if (!response.ok) {
                  throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
      })
      .then(data => {
            // Clear the bookings elements
            bookingHeading.textContent = 'Bookings for ' + selectedDate;
            bookings.innerHTML = '';

            timeSlots = [];
            // If there are no bookings say no bookings
            if (data.results.length === 0) {
                  bookingHeading.textContent = 'No bookings for this date. You can be the first!';
            }else{
                  data.results.forEach(booking => {
                        // Create a new elements for name and time
                        const p = document.createElement('p');
                        const span = document.createElement('span');
                        // Set the text of the p element to the name of the booking
                        p.textContent = booking.name;
                        // Set the text of the span element to the time of the booking
                        span.textContent = formatTime(booking.time);
                        span.className = 'booking-time';
                        // Append the p element to the bookings element
                        bookings.appendChild(p);
                        bookings.appendChild(span);
                        timeSlots += booking.time;
                  });
            }
            timeSlots = []
            // Loop through the bookings
            // If everything is successful, then add time slots which are not booked
            slot_options = reservationSlot.innerHTML;
            reservationSlot.innerHTML = '';
            // Loop through the bookings returned from the API and see if the time slot is booked
            for(let i = 9; i <  23; i += 0.5){
                  const formattedTime = formatTime(i);
                  if(timeSlots.includes(i)){
                        slot_options +=  `<option value="${formattedTime}" disabled>${formattedTime}</option>`
                  }else{
                        slot_options += `<option value="${formattedTime}">${formattedTime}</option>`
                  }
            }      
            reservationSlot.innerHTML = slot_options;     
      })
      .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
      });
}

function reserve(){
      // Get the date the user selected
      const selectedDate = reservationDate.value;
      const selectedTime = reservationSlot.value;
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const numberOfGuests = document.querySelector('#number_of_guests').value;
      
      // Fetch the bookings for the selected date
      fetch('/api/bookings/', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                  name: name,
                  email: email,
                  date: selectedDate,
                  time: selectedTime,
                  number_of_people: numberOfGuests
            })
      })
      .then(response => {
            if (!response.ok) {
                  throw new Error('Network response error: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
      })
      .then(data => {
            getBookings();
      })
      .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
      });
}
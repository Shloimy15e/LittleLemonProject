const date = document.querySelector('#date');
const reservationDate = document.querySelector('#reservation_date');

reservationDate.addEventListener('change', function() {
});

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
            // Get the bookings element
            const bookingHeading = document.querySelector('#booking-heading');
            const bookings = document.querySelector('#bookings');
            // Clear the bookings elements
            bookingHeading.textContent = 'Bookings for ' + selectedDate;
            bookings.innerHTML = '';
            // If there are no bookings say no bookings
            if (data.results.length === 0) {
                  bookingHeading.textContent = 'No bookings for this date. You can be the first!';
                  return;
            }
            // Loop through the bookings
            data.results.forEach(booking => {
                  // Create a new elements for name and time
                  const p = document.createElement('p');
                  const span = document.createElement('span');
                  // Set the text of the p element to the name of the booking
                  p.textContent = booking.name;
                  // Set the text of the span element to the time of the booking
                  span.textContent = booking.time;
                  span.className = 'booking-time';
                  // Append the p element to the bookings element
                  bookings.appendChild(p);
            });
            // If everything is successful, then add time slots which are not booked
            const timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
            const reservationSlot = document.querySelector('#reservation_slot');
            reservationSlot.innerHTML = '';
            // Loop through the bookings returned from the API and see if the time slot is booked
            
            
      })
      .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
      });

}
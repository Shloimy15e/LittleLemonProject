const date = document.querySelector('#date');
const reservationDate = document.querySelector('#reservation_date');

reservationDate.addEventListener('change', getBookings);

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
            const reservationSlot = document.querySelector('#reservation_slot');
            // Clear the bookings elements
            bookingHeading.textContent = 'Bookings for ' + selectedDate;
            bookings.innerHTML = '';
            // If there are no bookings say no bookings
            if (data.results.length === 0) {
                  bookingHeading.textContent = 'No bookings for this date. You can be the first!';
                  return;
            }
            timeSlots = []
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
                  bookings.appendChild(span);
                  timeSlots += booking.time;
            });
            // If everything is successful, then add time slots which are not booked
            slot_options = reservationSlot.innerHTML;
            reservationSlot.innerHTML = '';
            // Loop through the bookings returned from the API and see if the time slot is booked
            for(let i = 9; i <  21; i += 0.5){
                  const formattedTime = formatTime(i);
                  if(timeSlots.includes(i)){
                        slot_options +=  `<option value="${formattedTime}" disabled>${formattedTime}</option>`
                  }else{
                        slot_options += `<option value="${formattedTime}">${formattedTime}</option>`
                  }
            }      
            reservationSlot.innerHTML = slot_options;     
            function formatTime(hours) {
                  const date = new Date(0);
                  date.setSeconds(hours * 3600); // convert hours to seconds
                  return date.toISOString().substr(11, 8);
            } 
      })
      .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
      });

}
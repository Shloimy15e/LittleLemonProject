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
            bookingHeading.textContent = 'Bookings for ' + selectedDate;
            bookings.innerHTML = '';

            timeSlots = [];
            // If there are no bookings say no bookings
            if (data.length === 0) {
                  bookingHeading.textContent = 'No bookings for this date. You can be the first!';
            }else{
                  data.forEach(booking => {
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
                        timeSlots.push(formatTime(booking.time));
                  });
            }
            // If everything is successful, then add time slots which are not booked
            slot_options = '';
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
                  bookingHeading.textContent += ' An error occurred while fetching bookings. <br> Please contact us for assistance. <br> We apologize for the inconvenience.';
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
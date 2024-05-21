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
export {formatTime};
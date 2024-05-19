// Define load more button
const loadMore = document.querySelector('#load-more');

// Define the initial page number
let page = 2;

// add event listener to load more button
loadMore.addEventListener('click', function() {

      // when the button is clicked, fetch the next page from the api
            fetch('/api/menu?page=' + page)
            .then(response => {
                  if (!response.ok) {
                        throw new Error('Network response was not ok');
                  }
                  return response.json();
            })
            .then(data => {
                  // Get the menu element
                  const menu = document.querySelector('.column');
                  data.results.forEach(item => {
                        // Create a new p element
                        const p = document.createElement('p');
                        const a = document.createElement('a');
                        const span = document.createElement('span');
                        // Set the text of the a element to the name of the item
                        a.textContent = item.name;
                        // Set the text of the span element to the price of the item
                        span.textContent = '$' + item.price;
                        span.className = 'menu-price';
                        // Append the a and span elements to the p element
                        p.appendChild(a);
                        p.appendChild(span);
                        menu.appendChild(p);
                  });
                  // Increment the page number
                  page++;
                  // If there are no more results, hide the load more button
                  if (data.next === null) {
                        loadMore.disabled = true;
                        loadMore.textContent = 'No more items to load';
                        return;
                  }
            })
            .catch(error => {
                  console.error('There has been a problem with your fetch operation:', error);
            });
      });
      


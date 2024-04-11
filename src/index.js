// Your code here
document.addEventListener('DOMContentLoaded', function() {
    const filmsList = document.getElementById('films');
    const posterImg = document.getElementById('poster');
    const titleDiv = document.getElementById('title');
    const runtimeDiv = document.getElementById('runtime');
    const filmInfoDiv = document.getElementById('film-info');
    const showtimeSpan = document.getElementById('showtime');
    const ticketNumSpan = document.getElementById('ticket-num');
    const buyTicketButton = document.getElementById('buy-ticket');
    
    let moviesData; // Variable to store movie data

    // Fetch movie data from db.json
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            moviesData = data.films;
            renderMoviesList(); // Render movies list after fetching data
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });

    // Function to render movies list
    function renderMoviesList() {
        filmsList.innerHTML = ''; // Clear existing list
        moviesData.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.classList.add('film', 'item');
            listItem.textContent = movie.title;
            listItem.addEventListener('click', function() {
                // Update poster and showing info on movie selection
                updateMovieInfo(movie);
            });
            filmsList.appendChild(listItem); // Append movie list item to films list
        });
    }

    // Function to update movie details
    function updateMovieInfo(movie) {
        posterImg.src = movie.poster; // Set poster image source
        titleDiv.textContent = movie.title; // Set movie title
        runtimeDiv.textContent = `${movie.runtime} minutes`; // Set movie runtime
        filmInfoDiv.textContent = movie.description; // Set movie description
        showtimeSpan.textContent = movie.showtime; // Set movie showtime
        updateTicketInfo(movie); // Update ticket information
    }

    // Function to update ticket information
    function updateTicketInfo(movie) {
        const remainingTickets = movie.capacity - movie.tickets_sold;
        if (remainingTickets > 0) {
            ticketNumSpan.textContent = `${remainingTickets} remaining tickets`; // Display remaining tickets
            buyTicketButton.disabled = false; // Enable the "Buy Ticket" button
        } else {
            ticketNumSpan.textContent = 'Sold Out'; // Display "Sold Out" message
            buyTicketButton.disabled = true; // Disable the "Buy Ticket" button
        }
    }

    // Add event listener to "Buy Ticket" button
    buyTicketButton.addEventListener('click', function() {
        const selectedMovie = moviesData.find(movie => movie.title === titleDiv.textContent);
        if (selectedMovie) {
            selectedMovie.tickets_sold++; // Increment tickets sold for the selected movie
            updateTicketInfo(selectedMovie); // Update ticket information
        }
    });

    // Create operation: Add a new movie
    function createMovie(newMovie) {
        moviesData.push(newMovie);
        renderMoviesList(); // Re-render movies list with the new movie
    }

    // Update operation: Update an existing movie
    function updateMovie(movieId, updatedData) {
        const movieToUpdate = moviesData.find(movie => movie.id === movieId);
        if (movieToUpdate) {
            Object.assign(movieToUpdate, updatedData);
            renderMoviesList(); // Re-render movies list with the updated movie
        } else {
            console.error('Movie not found.');
        }
    }

    // Delete operation: Remove a movie
    function deleteMovie(movieId) {
        const index = moviesData.findIndex(movie => movie.id === movieId);
        if (index !== -1) {
            moviesData.splice(index, 1);
            renderMoviesList(); // Re-render movies list after deletion
        } else {
            console.error('Movie not found.');
        }
    }
});
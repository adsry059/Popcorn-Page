// popcorn.js
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your TMDb API key
const diary = [];

function searchMovies() {
  const query = document.getElementById('search-input').value;
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
    .then(res => res.json())
    .then(data => showResults(data.results))
    .catch(err => console.error(err));
}

function showResults(movies) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : 'https://via.placeholder.com/100x150?text=No+Image';

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div>
        <h3>${movie.title}</h3>
        <p>${movie.release_date || 'No release date'}</p>
        <button onclick='addToDiary(${JSON.stringify(movie)})'>Add to Diary</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

function addToDiary(movie) {
  diary.push(movie);
  displayDiary();
}

function displayDiary() {
  const diaryDiv = document.getElementById('diary');
  diaryDiv.innerHTML = '';
  diary.forEach(movie => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : 'https://via.placeholder.com/100x150?text=No+Image';

    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" />
      <div>
        <h3>${movie.title}</h3>
        <p>${movie.release_date || 'No release date'}</p>
      </div>
    `;
    diaryDiv.appendChild(card);
  });
}

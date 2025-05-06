const API_KEY = '4c859dfb6da8c5cbb7b84a7b8833cdc6'
const BASE_URL = 'https://api.themoviedb.org/3'
const LANGUAGE = 'ko-KR';

const searchBtn = document.getElementById('searchbtn');
const searchInput = document.getElementById('search');

const modal = document.querySelector('.modal');
const modalDetails = document.getElementById('modal-details');

const fetchMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`);

    if (!response.ok) {
      throw new Error(`HTTP error : ${response.status}`)
    }
    const data = await response.json();
    console.log('영화:', data.results);

    makeCards(data.results);
  } catch(error){
    console.error('데이터 문제 발생', error)
  }
}

const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    makeCards(data.results);
  } catch (error) {
    console.error('검색 실패:', error);
  }
};

function makeCards(movies) {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
      <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">⭐ ${movie.vote_average}</p>
          <p class="card-text">${movie.overview.substring(0, 100)}...</p>
      </div>
      </div>
    `;

    card.addEventListener('click', () => fetchMovieDetails(movie.id));
    cardContainer.appendChild(card);
  });
}

function fetchMovieDetails(movieId) {
  fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
      return res.json();
    })
    .then(movie => modalOpen(movie))
    .catch(error => console.error('상세 정보 불러오기 실패:', error));
}

function modalOpen(movie) {
  modalDetails.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
    <h2>${movie.title}</h2>
    <p class="card-text">⭐ ${movie.vote_average}</p>
    <p class="card-text">${movie.overview.substring(0, 100)}...</p>
  `;
  modal.style.display = 'flex';
  history.pushState({ modalOpen: true }, '', `#movie-${movie.id}`);
}

function modalClose() {
  modal.style.display = 'none';
}

modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    modalClose();
  }
});

window.addEventListener('popstate', () => {
  if (modal.style.display === 'flex') {
    modalClose();
  }
});

searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  if (query){
    searchMovies(query);
  }
});

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value;
    if (query) {
      searchMovies(query);
    }
  }
});

fetchMovies();
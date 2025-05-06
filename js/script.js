const API_KEY = '4c859dfb6da8c5cbb7b84a7b8833cdc6';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'ko-KR';

const searchBtn = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const cardContainer = document.getElementById('movie-list');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalOverview = document.getElementById('modal-overview');
const modalRelease = document.getElementById('modal-release');

window.addEventListener('DOMContentLoaded', fetchPopular);

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) fetchSearch(q);
});

searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    fetchSearch(searchInput.value.trim());
  }
});

modalClose.addEventListener('click', () => {
  hideModal();
  history.back();
});

window.addEventListener('popstate', () => {
  hideModal();
});

function hideModal() {
  modal.classList.remove('show');
  modalTitle.textContent = '';
  modalOverview.textContent = '';
  modalRelease.textContent = '';
}

async function fetchPopular() {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    if (!res.ok) throw new Error(res.status);
    const { results } = await res.json();
    makeCards(results);
  } catch (e) {
    console.error('인기 영화 로드 실패:', e);
  }
}

async function fetchSearch(query) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(res.status);
    const { results } = await res.json();
    makeCards(results);
  } catch (e) {
    console.error('검색 실패:', e);
  }
}

function makeCards(movies) {
  cardContainer.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average ?? '정보 없음'}</p>
    `;
    card.addEventListener('click', () => showDetail(movie.id));
    cardContainer.appendChild(card);
  });
}

async function showDetail(id) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${LANGUAGE}`
    );
    if (!res.ok) throw new Error(res.status);
    const film = await res.json();

    modalTitle.textContent = film.title;
    modalOverview.textContent = film.overview || "설명 없음";
    modalRelease.textContent = film.release_date ? `개봉일: ${film.release_date}` : "개봉일 정보 없음";

    modal.classList.add('show');
    history.pushState({ movieId: id }, '', `?movie=${id}`);
  } catch (e) {
    console.error('상세 정보 로드 실패:', e);
  }
}

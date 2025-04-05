import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('.load-more');

let query = '';
let page = 1;

form.addEventListener('submit', async event => {
  event.preventDefault();

  query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({ message: 'Please enter a valid search query!' });
    return;
  }

  clearGallery();
  page = 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (!data.hits.length) {
      iziToast.warning({ message: 'No images found!' });
      return;
    }

    createGallery(data.hits);
    if (data.totalHits > data.hits.length) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Failed to fetch images!' });
  } finally {
    hideLoader();
  }
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);

    const totalLoadedImages = page * 15;
    if (totalLoadedImages >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      const cardHeight = galleryItems[0].getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Failed to load more images!' });
  } finally {
    hideLoader();
  }
});

const data = await getImagesByQuery(query, page);

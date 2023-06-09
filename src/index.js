import './css/styles.css';
import {fetchCountries} from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(e) {
    resetInput();
    e.preventDefault();

    const name = e.target.value.trim();
    if (name === '') {
        return;
    }
    
    fetchCountries(name)
    .then(name => {
        if (name.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        if (name.length >=2 && name.length <=10) {
            countrySearchList(name);
            }
            else {
                if (name.length === 1) {
                countryFullInfo(name);
                }
            }
        }
    })
    .catch(error => Notify.failure("Oops, there is no country with that name"))
    .finally(() => {});
}

function resetInput() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}

function countrySearchList(name) {
    const listMarkup = name
    .map(({ name, flags }) => {
      return `<li>
            <img src="${flags.svg}" 
            alt="${name.official}" 
            width = "25" 
            height = "15" /> <span>${name.official}</span>
            </li>`;
    })
    .join('');

  refs.list.innerHTML = listMarkup;
  refs.info.innerHTML = '';
}

function countryFullInfo (name) {
    const fullInfoMarkup = name
    .map(({ name, flags, capital, population, languages }) => {
        return `<img 
        src="${flags.svg}" 
        alt="${name.official}" width = "35" height = "25" /> <h1>${name.official}</h1>
            <p><h3>Capital:</h3> ${capital}</p>
            <p><h3>Population:</h3> ${population}</p>
            <p><h3>Languages:</h3> ${Object.values(languages).join(', ')}</p>`;
      })
      .join('');

    refs.info.innerHTML = fullInfoMarkup;
    refs.list.innerHTML = '';
  }

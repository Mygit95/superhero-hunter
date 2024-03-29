import {ts, publicKey, hashValue} from './credentials.js';

// Function to get query parameters from URL
function getQueryParam(name) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(name);
}

function fetchData() {
  const characterId = getQueryParam('characterId');

  const characterUrl = `https://gateway.marvel.com/v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;

  const reqCharDetails = fetch(characterUrl);

  reqCharDetails.then((response) => {
    return response.json();
  }).then((data) => {
    const characters = data.data['results'][0];
    createDivCharacter(characters, '300px', '350px');
  });
}

function createPTag(textContent) {
  const p = document.createElement('p');
  p.textContent = textContent;
  return p;
}

//Create character divs
function createDivCharacter(characterObj, width, height) {
  const heroDetails = document.querySelector('.container');

  // Create and set up the image element
  const img = document.createElement('img');
  img.src = characterObj.thumbnail.path + '.' + characterObj.thumbnail.extension;
  img.style.width = width;
  img.style.height = height;
  img.style.textAlign = 'center'
  heroDetails.appendChild(img);

  // Create and set up the h2 tag for hero name
  const h2tag = document.createElement('h2');
  h2tag.textContent = characterObj.name;
  heroDetails.appendChild(h2tag);

  // Create and set up the p tag for hero description
  const description = document.createElement('p');
  description.textContent = characterObj.description;
  heroDetails.appendChild(description);

  // Create and set up the ul tag for comics
  const comicTitle = document.createElement('h2');
  comicTitle.textContent = 'Comics';
  const comicsList = document.createElement('ul');
  characterObj.comics.items.forEach(comic => {
    const comicItem = document.createElement('li');
    const comicLink = document.createElement('a');
    comicLink.href = comic.resourceURI;
    comicLink.textContent = comic.name;
    comicItem.appendChild(comicLink);
    comicsList.appendChild(comicItem);
  });
  heroDetails.appendChild(comicTitle);
  heroDetails.appendChild(comicsList);

  // Create and set up additional links for more information
  const additionalInfo = document.createElement('h2');
  additionalInfo.textContent = 'Additional Links';

  const moreInfoList = document.createElement('ul');
  const marvelCharacterLink = document.createElement('li');
  const characterLink = document.createElement('a');
  characterLink.href = characterObj.urls.find(url => url.type === 'detail').url;
  characterLink.textContent = 'Marvel Character Page';
  marvelCharacterLink.appendChild(characterLink);
  moreInfoList.appendChild(marvelCharacterLink);

  const marvelComicLink = document.createElement('li');
  const comicLink = document.createElement('a');
  comicLink.href = characterObj.urls.find(url => url.type === 'comiclink').url;
  comicLink.textContent = 'Marvel Comic Page';
  marvelComicLink.appendChild(comicLink);
  moreInfoList.appendChild(marvelComicLink);

  heroDetails.appendChild(additionalInfo);
  heroDetails.appendChild(moreInfoList);
}

fetchData();
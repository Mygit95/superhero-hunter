import {ts, publicKey, hashValue} from './credentials.js';

//Get all necessary elments of the page
const charactersDiv = document.querySelector('.characters');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

//Redirect to favorite page
window.addEventListener("DOMContentLoaded", (event) => {
  const myFavoriteButton = document.querySelector('.favorite-button'); 
  if (myFavoriteButton) {
      myFavoriteButton.addEventListener('click', function() {
          // Redirect to favorite page
          window.location.href = 'favoritePage.html';
      });
  } else {
      console.error("Button not found");
  }
});

// Function to fetch character data
async function fetchCharacterData(query) {

  let characterUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;

  if(query.length > 0) {
    characterUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${query}`;
  }

  const requestCharacters = fetch(characterUrl);

  try {
    requestCharacters.then((response) => {
        if (!response.ok) {
            throw "URL is not available";
        }
        return response.json();
    }).then((data) => {
        charactersDiv.innerHTML = '';
        const characters = data.data['results'];
        // Loop through the response and display characters with names
        displaySearchResults(characters);
    }).catch((error) => {
        console.log(error);
    });
  } 
  catch (error) {
    console.log(error);
  }
}

//Function to display search results
export function displaySearchResults(results) {
    for (const item in results) {
          charactersDiv.appendChild(createDivCharacter(results[item], '250px', '300px'));
    }
}

// Event listener for search input
searchButton.addEventListener('click', async function() {
  const query = searchInput.value.trim();
  localStorage.setItem("query", JSON.stringify(query));
  fetchCharacterData(query);
});

//Create character divs
function createDivCharacter(characterObj, width, height) {
  const characterDiv = document.createElement('div');
  characterDiv.className = 'character';
  
  const img = document.createElement('img');
  img.src = characterObj['thumbnail']['path'] + "." + characterObj['thumbnail']['extension'];
  img.style.width = width;
  img.style.height = height;

  const h2tag = document.createElement('h2');
  h2tag.textContent = characterObj['name'];

  const addToFavorite = document.createElement('button');
  
  if (isAddedToFavorites(characterObj)) {
    changeButtonText(addToFavorite);
  } else {
    addToFavorite.textContent = "Add to Favorites";
  }
  
  addToFavorite.style.width = '120px';
  addToFavorite.style.height = '20px';

  //Add event Listener to addToFavorites Button
  addToFavorite.addEventListener('click', function() {
    let favorites = getFavorites();
    favorites.push(characterObj);
    //update local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
    changeButtonText(addToFavorite);
  });

  characterDiv.appendChild(img);
  characterDiv.appendChild(h2tag);
  characterDiv.appendChild(addToFavorite);


  const characterId = characterObj['id'];
  img.addEventListener('click', function() {
    // Redirect to Details HTML page
    window.location.href = `superHeroPage.html?characterId=${characterId}`;
  });

  return characterDiv;
}

//Used to change the color of favorite Button 
function changeButtonText(addToFavorite) {
  addToFavorite.textContent = "Already Added!";
  addToFavorite.style.backgroundColor = 'green';
  addToFavorite.disabled = true;
}

//Check if a character is already added to Favorites
function isAddedToFavorites(characterObj) {
  let favorites = getFavorites();
  return favorites.some((element) => element['id'] === characterObj['id']);
}

//Save alarms to local storage for caching
function getFavorites() {
  let favorites = [];
  const isPresent = localStorage.getItem("favorites");
  if (isPresent) favorites = JSON.parse(isPresent);

  return favorites;
}

//This is to cache the query text
const queryText =  JSON.parse(localStorage.getItem("query")).trim();
fetchCharacterData(queryText);

let favorites = [];

const isPresent = localStorage.getItem("favorites");

if (isPresent) favorites = JSON.parse(isPresent);

const favoriteList = document.querySelector('.favorite-list');

//Function to display search results
function displaySearchResults(results) {
    favoriteList.innerHTML = '';
    for (const item in results) {
      favoriteList.appendChild(createDivCharacter(results[item], '250px', '300px'));
    }
}

//Populate the favorite list
function createDivCharacter(characterObj, width, height) {
  const characterDiv = document.createElement('div');
  characterDiv.className = 'character';
  
  const img = document.createElement('img');
  img.src = characterObj['thumbnail']['path'] + "." + characterObj['thumbnail']['extension'];
  img.style.width = width;
  img.style.height = height;

  const h2tag = document.createElement('h2');
  h2tag.textContent = characterObj['name'];

  const removeFromFavorite = document.createElement('button');
  removeFromFavorite.textContent = 'Remove';
  removeFromFavorite.style.width = '120px';
  removeFromFavorite.style.height = '20px';
  removeFromFavorite.style.backgroundColor = 'red';

  //Add event Listener to addToFavorites Button
  removeFromFavorite.addEventListener('click', function() {
    removeFromFavoriteFun(characterObj);
  });

  const characterId = characterObj['id'];
  img.addEventListener('click', function() {
    // Redirect to Details HTML page
    window.location.href = `superHeroPage.html?characterId=${characterId}`;
  });

  characterDiv.appendChild(img);
  characterDiv.appendChild(h2tag);
  characterDiv.appendChild(removeFromFavorite);

  return characterDiv;
}

//this function removes heroes from the list
function removeFromFavoriteFun(characterObj) {
  for(let i = 0; i < favorites.length; i++) {
    if(favorites[i]['id'] === characterObj['id']) {
      favorites.splice(i, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      displaySearchResults(favorites);
      break;
    }
  }
}

displaySearchResults(favorites);
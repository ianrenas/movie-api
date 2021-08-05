let pokemonRepository = (function() {
  //modal
  let pokedexPokemonList = document.querySelector('.list-group');
  let modal = document.querySelector('.modal-content');
  //create Elements
  let pokeName = document.createElement('h1');
  pokeName.classList.add('Pokename');
  let pokeHeight = document.createElement('p');
  pokeHeight.classList.add('Pokeheight');
  let pokeType = document.createElement('p');
  pokeType.classList.add('Poketype');
  let pokeImage = document.createElement('img');
  pokeImage.classList.add('Pokeimage');
  let imageContainer = document.createElement('div');
  imageContainer.classList.add('img-container');

  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //returns pokemonList
  function getAll() {
    return pokemonList;
  }

  //adds new objects to the list from the outside
  function add(pokemon) {
    if (typeof pokemon === "object" && 'name' in pokemon && 'detailsUrl' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  function addListItem(pokemon){

    let pokemonItem = document.createElement('li');//variable creating the list item
    pokemonItem.classList.add('group-list-item');
    let pokemonButton = document.createElement('button'); // variable creating a button
    pokemonButton.innerHTML = pokemon.name.toUpperCase();
    pokemon.type = 'button'
    pokemonButton.classList.add('btn');
    pokemonButton.classList.add('btn-primary');
    pokemonButton.dataset.toggle = 'modal'
    pokemonButton.dataset.target = '#pokemon-modal'
    pokedexPokemonList.appendChild(pokemonItem);
    pokemonItem.appendChild(pokemonButton);
    pokemonButton.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

  //  Displays pokemons
  function showDetails(pokemon){
    pokemonRepository.loadDetails(pokemon).then(function () {
      pokeName.innerHTML = pokemon.name.toUpperCase();
      pokeHeight.innerHTML = 'Height: ' + pokemon.height;
      pokeType.innerHTML = 'Type: ' + pokemon.types.toUpperCase();
      pokeImage.src = pokemon.imageUrl;
    });
  }



  //adds fetch function
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
        console.log(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  // loads details from API
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response){
      return response.json();
    }).then(function (details) {
      //adds details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      // calls the types array
      item.types = details.types[0].type.name;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function search() {
    let searchInput = document.querySelector('#search-bar');
    searchInput.addEventListener('input', function () {
      let pokemonList = document.querySelectorAll('.group-list-item');
      let searchText = searchInput.value.toLowerCase();
      pokemonList.forEach(function (pokemon) {
        if (pokemon.innerText.toLowerCase().indexOf(searchText) > -1) {
          pokemon.style.display = '';
        } else {
          pokemon.style.display = 'none';
        }
      });
    });
  }

  modal.appendChild(pokeName);
  modal.appendChild(pokeHeight);
  modal.appendChild(pokeType);
  modal.appendChild(imageContainer);
  imageContainer.appendChild(pokeImage);

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    search: search
  };

})();


//loads data
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon)
    pokemonRepository.search();
  });
});

let pokemonRepository = (function() {
  //modal
  let pokedexPokemonList = document.querySelector('.pokemon-list');
  let modalContainer = document.querySelector('#modal-container');
  let modal = document.querySelector('.modal');
  //create Elements
  let modalClose = document.createElement('button');
    modalClose.classList.add('modal-close');
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
      console.log(
        "pokemon is not correct"
      );
    }
  }

  function addListItem(pokemon){
    let pokemonList = document.querySelector('.pokemon-list');//variable used for <ul> in index.html
    let listItem = document.createElement('li');//variable creating the list item
    let button = document.createElement('button'); // variable creating a button
    button.innerText = pokemon.name.toUpperCase(); // assigns the button text to pokemon name
    button.classList.add("button-class");//for CSS styling

    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    button.addEventListener('click', function(event){
      showDetails(pokemon);
    });
  }

//show modal function
  function showModal () {
    modalContainer.classList.add('is-visible');
  }

//hide modal event listeners (esc key, click x, click outside of modal)
  function hideModal () {
    modalContainer.classList.remove('is-visible');
  }

  modalClose.addEventListener('click', hideModal);

  window.addEventListener('keydown', (e) => {
    let modalContainer = document.querySelector('#modal-container');
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  modalContainer.addEventListener('click', (e) => {
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  //  Displays pokemons
  function showDetails(pokemon){
  		pokemonRepository.loadDetails(pokemon).then(function () {
        pokeName.innerHTML = pokemon.name.toUpperCase();
  			pokeHeight.innerHTML = 'Height: ' + pokemon.height;
        pokeType.innerHTML = 'Type: ' + pokemon.types.toUpperCase();
        pokeImage.src = pokemon.imageUrl;
        modalClose.innerHTML = 'Close';
        showModal ();
  		});

    modal.appendChild(modalClose);
    modal.appendChild(pokeName);
    modal.appendChild(pokeHeight);
    modal.appendChild(pokeType);
    modal.appendChild(imageContainer);
    imageContainer.appendChild(pokeImage);
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

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };

})();

let newPokemon = {
  name: "Charmander",
  height: 0.6,
  types: ["fire"]
};

pokemonRepository.add(newPokemon);

//loads data
pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon){
		pokemonRepository.addListItem(pokemon);
	});
});

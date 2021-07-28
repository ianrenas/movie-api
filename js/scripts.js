let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //returns pokemonList
  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon){
    let pokemonList = document.querySelector('.pokemon-list');//variable used for <ul> in index.html
    let listpokemon = document.createElement('li');//variable creating the list item
    let button = document.createElement('button'); // variable creating a button
    button.innerText = pokemon.name; // assigns the button text to pokemon name
    button.classList.add("button-class");//for CSS styling
    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);
    button.addEventListener('click', function(){
      showDetails(pokemon);
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
			});
		}).catch(function (e) {
			console.error(e);
		});
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
			item.types = [];
			for ( let i = 0; i < details.types.length; i++) {
				item.types.push(details.types[i].type.name);
			}
		}).catch(function (e) {
			console.error(e);
		});
	}

  function showDetails(pokemon) {
    console.log(pokemon);
  }

  //adds new objects to the list from the outside
  function add(pokemon) {
    if (typeof pokemon === "object" && 'name' in pokemon && 'detailsUrl' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log(
        "pokemon needs to be an object and contains a name property"
      );
    }
  }

  //  Displays pokemons
	function showDetails(pokemon){
		pokemonRepository.loadDetails(pokemon).then(function () {
			console.log(pokemon);
		});
	}


  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  }

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

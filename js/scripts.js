let pokemonRepository = (function() {
  let pokemonList = [
    {
      name: "Venusaur",
      height: 2,
      types: ["grass", "poison"],
    },
    {
      name: "Charizard",
      height: 1.7,
      types: ["fire", "flying"],
    },
    {
      name: "Nidoking",
      height: 1.4,
      types: ["ground", "poison"],
    },
  ];

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

  function showDetails(pokemon) {
    console.log(pokemon);
  }

  //adds new objects to the list from the outside
  function add(pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log(
        "pokemon needs to be an object and contains a name property"
      );
    }
  }

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem
  }

})();

let newPokemon = {
  name: "Charmander",
  height: 0.6,
  types: ["fire"]
};

pokemonRepository.add(newPokemon);

pokemonRepository.getAll().forEach(function(pokemon) {
  pokemonRepository.addListItem(pokemon);


});

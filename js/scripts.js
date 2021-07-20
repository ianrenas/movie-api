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

	function getAll() {
		return pokemonList;
	}

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
		add: add
	}

})();

let newPokemon = {
  name: "Charmander",
  height: 0.6,
  types: ["fire"]
};

pokemonRepository.add(newPokemon);

pokemonRepository.getAll().forEach(function (pokemon) {
  //Pokemon name and height to the DOM
  document.write(pokemon.name + "(height: " + pokemon.height + ")");

  //if pokemon height is greater than 1.8, writes Wow, that's big
  if (pokemon.height > 1.7) {
    document.write (" -Wow, that's big!");
	}

	//Adds line breaks after each pokemon name
  document.write("<br><br>");
});



// TO HERE

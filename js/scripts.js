let pokemonList = [
  {
    name: 'Venusaur',
    height: 2,
    types: ['grass', 'poison'],
  },
  {
    name: 'Charizard',
    height: 1.7,
    types: ['fire', 'flying'],
  },
  {
    name: 'Nidoking',
    height: 1.4,
    types: ['ground', 'poison'],
  },
];

let pokemonRepository = (function() {

   let pokemonList = [];

   function add(pokemon) {
      if (typeof pokemon === "object") {
         pokemonList.push(pokemon);
      }
  }

   function getAll() {
      return pokemonList;
   }

   return {
      add: add,
      getAll: getAll
   }
})();

pokemonRepository.add({
    name: 'Venusaur',
    height: 2,
    types: ['grass', 'poison']
});

pokemonRepository.getAll().forEach(function (pokemon) {
  document.write (pokemon.name + pokemon.height);
});


  //if pokemon height is greater than 1.8, writes Wow, that's big
  if (pokemon.height > 1.7) {
    document.write (" -Wow, that's big!");
  }

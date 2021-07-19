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

let pokemonRepository = (function () {
  let pokemonList = [];
 function add(pokemon) {
   pokemonList.push(pokemon);
 }
 function getAll () {
   return pokemonList;
 }
 return {
   add: add,
   getAll: getAll
 };
})();

pokemonList.forEach(function(pokemon) {
  //Pokemon name and height to the DOM
  document.write (pokemon.name + pokemon.height);
});

  //if pokemon height is greater than 1.8, writes Wow, that's big
if (pokemon.height > 1.7) {
  document.write (" -Wow, that's big!");
}
//Adds line breaks after each pokemon name
  document.write ('<br><br>')

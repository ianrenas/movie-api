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

pokemonList.forEach(function(pokemon) {
  //Pokemon name and height to the DOM
  document.write (pokemon.name + pokemon.height);
});

  //if pokemon height is greater than 1.8, writes Wow, that's big
if (pokemonList[i].height > 1.7) {
  document.write (" -Wow, that's big!");
}
//Adds line breaks after each pokemon name
  document.write ("<br><br>");


function div(dividend,divisor) {
  if (divisor === 0){
    return "You're trying to divide by zero."
  }else {
      let result = dividend / divisor;
      return result;
    }
  }

  console.log(div(4, 2));
  console.log(div(7, 0));
  console.log(div(1, 4));
  console.log(div(12, -3));

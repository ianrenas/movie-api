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

for (let i = 0; i < pokemonList.length; i++)
{
  //Pokemon name and height to the DOM
  document.write (pokemonList[i].name + "(height: " + pokemonList[i].height + ")");
}
  //if pokemon height is greater than 1.8, writes Wow, that's big
if (pokemonList[i]. height > 1.8){
  document.write (" -Wow, that's big!");
}

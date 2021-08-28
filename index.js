const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();


// Logging middleware
app.use(morgan('common'));
// For the sending of static files
app.use(express.static('public'));
// Using body-parser
app.use(bodyParser.json());


// My topTenMovies array
let topTenMovies = [
  {
    id: '1',
    title: 'The Lost Boys',
    year: '1987'
  },
  {
    id: '2',
    title: 'The Empire Strikes Back',
    year: '1980'
  },
  {
    id: '3',
    title: 'Back to the Future',
    year: '1985'
  },
  {
    id: '4',
    title: 'Stand by Me',
    year: '1986'
  },

  {
    id: '5',
    title: 'Beverly Hills Cop',
    year: '1984'
  },
  {
    id: '6',
    title: 'The Breakfast Club',
    year: '1985'
  },
  {
    id: '7',
    title: 'Raiders of the Lost Ark',
    year: '1981'
  },
  {
    id: '8',
    title: 'The Karate Kid',
    year: '1984'
  },
  {
    id: '9',
    title: 'Ghostbusters',
    year: '1984'
  },
  {
    id: '10',
    title: 'Top Gun',
    year: '1986'
  }
]

// Get Request-Returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my Super-80s-Flix movie database!');
});

// Get Request-Returns my top ten movies
app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

// Get data about a certain movie, by title
app.get('/movies/:Title', (req, res) => {
  res.json(topTenMovies.find((movie) => {
    return movie.title === req.params.title
  }));
});

// Get data about genre
app.get('/genres/:Name', (req, res) => {
  res.json(genres);
});

// Get data about director
app.get('/directors/:Name', (req, res) => {
  res.json(directors);
});

// Add a new user
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.title) {
    const message = 'Missing username in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    topTenMovies.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update user info


// Add a movie
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing movie title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    topTenMovies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

// Delete a movie from the list of favorites
app.delete('/users/:Username/removeFromFav/:MovieID', (req, res) => {
  let movie = topTenMovies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    topTenMovies = topTenMovies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie with the ID of ' + req.params.id + ' was deleted.');
  } else {
    res.status(404).send(`Movie with the id ${req.params.id} was not found.`);
  }
});

// Allows users to deregister





//Get Request-
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});



//Error Handling Middlware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops! Something has gone wrong');
});



app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

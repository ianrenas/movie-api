const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

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

mongoose.connect('mongodb://localhost:27017/movie-apiDB', { useNewUrlParser: true, useUnifiedTopology: true });


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
  res.send("Successful GET request returning data about a certain movie")
});

// Get data about genre
app.get('/genres/:Name', (req, res) => {
  res.send("Successful GET request returning genres")
});

// Get data about director
app.get("/directors/:Name", (req, res) => {
  res.send("Successful GET request returning directors");
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update user info
app.put("/users/:username", (req, res) => {
  res.send("Successful PUT updating user info ");
});


// Add a movie
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
  res.send("Successful POST adding movie to favorites");
});

// Delete a movie from the list of favorites
app.delete('/users/:Username/removeFromFav/:MovieID', (req, res) => {
  res.send("Successful DELETE of movie from list of favorites");
});

  // Allows users to deregister
  app.delete('/users', (req, res) => {
    res.send("Successful DELETE of user");
  });




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

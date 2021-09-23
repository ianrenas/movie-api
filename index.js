const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

const { check, validationResult } = require('express-validator');


// Logging middleware
app.use(morgan('common'));
// For the sending of static files
app.use(express.static('public'));
// Using body-parser
app.use(bodyParser.json());

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/movie-apiDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Importing CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

//Imports auth.js file//
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');



// Get Request-Returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my Super-Cina-Flix movie database!');
});


// This is the first requirement
// Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  // When "find" is executed is going to return a promise with the movies that it found
  Movies.find()
  .then(movies => {
    // movies contains the movies founded in the mongodb, this is the same as this
    // res.json(topTenMovies); but instead of having hardcoded now those came from the db
    res.json(movies)
  })
  .catch(error => {
    // this will be manage the error, we will console log the error and return
    // the error to the browser as well
    console.log(error);
    res.status(500).send("Error: " + error);
  });
});


// This is the second requirement
// Get single movie by title to the user
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
   .then(movie => {
     res.json(movie);
   })
   .catch(error => {
     console.log(error);
     res.status(500).send('Error: ' + error);
   });
 });


// This is the third requirement
// Get data about genre
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then(movie => {
      res.json(movie.Genre);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error: ' + err);
    });
});

// This is the fourth requirement
// Get data about director
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then(movie => {
      res.json(movie.Director);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error: ' + error);
    });
  });

// This is the fifth requirement
//Add a user
/* We’ll expect JSON in this format
{
ID: Integer,
Username: String,
Password: String,
Email: String,
Birthday: Date
}*/
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// This is the sixth requirement
// Update a user's info, by username
/* We’ll expect JSON in this format
{
Username: String,
(required)
Password: String,
(required)
Email: String,
(required)
Birthday: Date
}*/
app.put('/users/:Username',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (error, updatedUser) => {
    if(error) {
      console.log(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

// This is the seventh requirement
// Post a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (error, updatedUser) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error: ' + error);
    } else {
      res.json(updatedUser);
    }
  });
});

// This is the eighth requirement
// Delete a movie from the list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username},
    { $pull: { FavoriteMovies: req.params.MovieID}},
    { new: true},
    (error, updateUser) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error: ' + error);
      } else {
        res.json(updateUser);
    }
  });
});

// This is the ninth requirement
// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then(user => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).send('Error: ' + error);
  });
});


// Do I need this code?
//Get Request-
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});



//Error Handling Middlware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops! Something has gone wrong');
});



const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

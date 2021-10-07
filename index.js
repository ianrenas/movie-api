const express = require('express'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      Models = require('./models.js'),
      bodyParser = require('body-parser'),
      { check, validationResult } = require('express-validator');

const app = express(),
      Movies = Models.Movie,
      Users = Models.User,
      cors = require('cors');

// Logging middleware
app.use(morgan('common'));
// For the sending of static files
app.use(express.static('public'));
// Using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

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


//Local host for testing//
mongoose.connect('mongodb://localhost:27017/movie-apiDB', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
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
check('Username', 'Username min 5 char is required').isLength({ min:5 }),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlpha('en-US',{ignore:' '}),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail(),
check('Birthday','Req format YYYY-MM-DD').isDate({format:'YYYY-MM-DD'}),
(req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists ');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
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
passport.authenticate('jwt', {session: false} ),
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true },
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
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

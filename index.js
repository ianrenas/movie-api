const express = require('express'),
morgan = require('morgan');

const app = express();

// Get Request-Returns my top ten movies
app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

//Get Request-
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Get Request-Returns a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to my Super-80s-Flix movie database!');
});

//Logging Middleware
app.use(morgan('common'));
// For sending static files
app.use(express.static('public'));

//Error Handling Middlware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops! Something has gone wrong');
});



app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

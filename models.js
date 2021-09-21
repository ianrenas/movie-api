const mongoose = require('mongoose');
//Importing bcrypt module from terminal//
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//Hashing of Password//
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
//Compares Passwords that have been hashed//
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};



let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


module.exports.Movie = Movie;
module.exports.User = User;

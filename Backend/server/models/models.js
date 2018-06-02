const mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	Schema = mongoose.Schema;

// USERS SCHEMA
const UserSchema = new Schema({
  userId:{
    type: String,
    require: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

// HASH USER PASSWORD BEFORE SAVE
UserSchema.pre('save', function(next)  {
  const user = this;
  // bycrypt.hash(user.password, null, null, function(err, hash) {
  //   if (err) throw err;
  //   user.password = hash;
  //   next();
  // })
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      // Store hash in your password DB.
      if (err) throw err;
      user.password = hash;
      next();
    });
  });
});

// PASSWORD COMPARISON METHOD
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


UserSchema.methods.usernameExist = function(username, cb){
  return this.model('User').findOne({ username }, 
    function(err, user){
      if(err) throw err;

       cb(user && (user.username == username))
    });
}

const ApplicationSchema = new Schema({
  applicant: { type: Schema.Types.ObjectId, ref: 'User' },
  userId: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  stateOfOrigin: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  applicationType: {
    type: String,
    required: true,
    default: "Private",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Application: mongoose.model('Application', ApplicationSchema),
};




// var schema = kittySchema = new Schema(..);
//
// schema.method('meow', function () {
//   console.log('meeeeeoooooooooooow');
// })

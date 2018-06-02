const jwt = require("jsonwebtoken");
const bycrypt = require('bcryptjs');
const async = require("async");
const { check, validationResult } = require('express-validator/check');

const models = require( '../models/models' );
const { isValidLoginData }  = require("../utils/validations")
const { isValidRegData, isValidFileData }  = require("../utils/validations")
const {	User, Application } = models;


function createToken(len = 8, 
  chars = "abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789")
{
  // generating token
  let token = "";
  while(len--)
  {
    token += chars[Math.random() * chars.length | 0]
  }

  return token;
}


function signin( req, res ) {

  const { username, password } = req.body;

  User.findOne({username}, "userId isAdmin username password", 
    function(err, user){
      if (err) {
        throw err;
      } else if ( user ) {
        var validPassword = user.comparePassword( password );
        if ( !validPassword ) {
          // invalid password provided
          return res.status(403).json( {
            success: false,
            message: ["Invalid credentials provided"]
          } );
        } else {
          // giving user a token which is needed 
          // for authentication
          const token = jwt.sign({
            id: user._id,
            userId: user.userId,
            isAdmin: user.isAdmin,
            username: user.username,
          }, process.env.JWT_SECRET);

          return res.status(200).json({
            success: true,
            message: ["Welcome"],
            payload: token,
          });
        }
      } else {
        // credentials cannot be verified
        return res.status(403).json({
          success: false,
          message: ["Invalid credentials provided"]
        });
      }
    })
}

function signup(req, res) {

  const { username, password, isAdmin } = req.body;
  const user = new User();

  //FETCH USERNAME NAME FROM DB AND CHECK IF EXIST
  user.usernameExist(username, function(exist){
    if(exist){
      return res.status( 403 ).json({
        success: false,
        message: ["Username already taken"],
      });
    }

    user.userId = createToken();
    user.username = username;
    user.password = password;
    user.isAdmin = isAdmin;

    user.save()
      .then(function (user) {
        // registration successful
        const token = jwt.sign({
          id: user._id,
          userId: user.userId,
          isAdmin: user.isAdmin,
          username: user.username,
        }, process.env.JWT_SECRET);

        return res.status( 201 ).json({
          success: true,
          message: ["Registration Successful!"],
          payload: token,
        });
      })
  });
}

function apply(req, res){

  const application = new Application();
  const {
    firstName,
    lastName,
    dob,
    email,
    sex,
    stateOfOrigin,
    occupation,
    applicationType,
    address,
  } = req.body;

  application.applicant = req._id;
  application.userId = req._userId;
  application.firstName = firstName;
  application.lastName = lastName;
  application.dob = dob;
  application.email = email;
  application.sex = sex;
  application.stateOfOrigin = stateOfOrigin;
  application.applicationType = applicationType;
  application.occupation = occupation;
  application.address = address;

  return async.waterfall([
    function(callback) {
      application.save()
        .then((app) => {
          callback(null, app)
        })
        .catch((err) => {
          callback(err, null)
        })
    }
  ], function (err, result) {

    if(err) throw err;

    return res.status( 200 ).json({
      success: true,
      message: ["Application submitted successfully"],
    });
  });
}

function reviewApplication(req, res){
}

function getApplicantsList(req, res){
  Application.find()
    .then(data => {
      return res.status( 200 ).json({
        success: true,
        message: ["Data successfully fetched"],
        payload: data,
      });
    })
    .catch(err => {
      return res.status( 200 ).json({
        success: true,
        message: ["Error in fetching data"],
      });
    })
}

function getStat(req, res){
}

module.exports = { 
  signup, 
  signin, 
  apply, 
  reviewApplication,
  getApplicantsList,
  getStat,
};

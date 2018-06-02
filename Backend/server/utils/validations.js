const { check, validationResult } = require('express-validator/check');
const models = require( '../models/models' );
const async = require("async");
const { Application } = models;


function catchError(req, res, next){

  let err = []
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    err = errors.array().map(e => e.msg)
  }

  const {password, cpassword, dob} = req.body;


  if(req.url === "/signup" 
    && !(password == cpassword)){
    err.push("password must match");
  }

  if(req.url === "/apply" && !(Date.parse(dob))){
    err.push("provide a valid date of birth");
  }
   
  // if(/\/admin\/review/.test(req.url) ){
  // }

  if (err.length) 
    return res.status(422).json({ 
      success: false,
      message: err 
    });

  next();
}

const isValidLoginData = [
  check('username')
  .isLength({ min: 4 })
  .withMessage('username must be at least 4 chars long'),
  check('password')
  .isLength({ min: 4 })
  .withMessage('password must be at least 4 chars long'),
];

const isValidRegData = [
  check('username')
  .isLength({ min: 4 })
  .withMessage('username must be at least 4 chars long'),
  check('password')
  .isLength({ min: 4 })
  .withMessage('password must be at least 4 chars long'),
  check('cpassword')
  .isLength({ min: 4 })
  .withMessage('password confirm must be at least 4 chars long'),
];


const isValidApplyData = [
  // check('photoUrl')
  // .isLength({ min: 4 })
  // .withMessage('username must be at least 4 chars long'),
  check('firstName')
  .isLength({ min: 2 })
  .withMessage('first name must be at least 2 chars long'),
  check('lastName')
  .isLength({ min: 2 })
  .withMessage('last name must be at least 2 chars long'),
  check('email')
  .isEmail()
  .withMessage('provide a valid email'),
  check('sex')
  .isLength({ min: 2 })
  .withMessage('sex is required'),
  check('applicationType')
  .isLength({ min: 2 })
  .withMessage('application type is required'),
  check('stateOfOrigin')
  .isLength({ min: 2 })
  .withMessage('state of origin is required'),
  check('occupation')
  .isLength({ min: 2 })
  .withMessage('occupation must be at least 2 chars long'),
  check('address')
  .isLength({ min: 2 })
  .withMessage('address must be at least 2 chars long'),
];

const isValidCommentData = [
  check('comment')
  .isLength({ min: 10 })
  .withMessage('comment must be at least 10 chars long'),
];

function duplicateApplicationData(req, res, next){
  return async.waterfall([
    function(callback) {
      Application.findOne({ userId: req._userId }, 
        function(err, application){
          callback(err, application);
        });
    }
  ], function (err, result) {

    if(err) throw err;

    const error = [];
    const { 
      email, 
    } = req.body;

    if(result){
      if(result.email == email){
        error.push("Email already taken");
      }
    }

    if(error.length){
      return res.status( 403 ).json({
        success: false,
        message: error,
      });
    }

    next();

  });


}


module.exports = {
  catchError, 
  duplicateApplicationData,
  isValidLoginData, 
  isValidRegData,
  isValidCommentData,
  isValidApplyData,
};

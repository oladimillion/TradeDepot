const express = require("express");
const route = express.Router();
const multer  = require('multer');

const {
  catchError,
  duplicateApplicationData,
  isValidLoginData, 
  isValidRegData,
  isValidApplyData,
  isValidCommentData,
} = require("../utils/validations");

let upload = null;

if(process.env.NODE_ENV != "production"){
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'server/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })
  upload = multer({storage: storage })
}


// if(process.env.NODE_ENV == "production"){
// upload = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // no larger than 5mb
//   },
// });
// }


const MainCtrl = require("../controllers/main-ctrl");
const  authenticate  = require("../middlewares/authenticate");

const { 
  signin, 
  signup, 
  apply,
  reviewApplication,
  getApplicantsList,
  getStat,
} = MainCtrl;


// USERS AUTHENTICATION
route.post('/signin', isValidLoginData, catchError, signin);


// USERS REGISTRATION
route.post('/signup', isValidRegData, catchError, signup);


route.post('/apply', 
  authenticate, 
  isValidApplyData,
  catchError,
  duplicateApplicationData,
  // upload.single('avatar'), 
  apply
);

route.put("/admin/review/:applicant", 
  authenticate, 
  isValidCommentData,
  catchError,
  reviewApplication
);

route.get("/admin/get-applicants-list", authenticate, getApplicantsList);
route.get("/admin/get-stat", authenticate, getStat);



module.exports = route;

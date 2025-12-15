const Listing = require("./model/listing");    
const { listingschema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewschema } = require("./schema.js");
const reviews = require("./model/reviews.js");





module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if  (req.session.redirectUrl  ) {
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
        next();
    };

module.exports.isowner = async (req, res, next) => {
     let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validatelisting = (req,res,next)=>{
     let {error} = listingschema.validate(req.body);
  if (error) {
    let msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg);
  }
  else{
    next();
  }
 };


 module.exports.validatereview = (req,res,next)=>{
      let {error} = reviewschema.validate(req.body);
   if (error) {
     let msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(400, msg);
   }
   else{
     next();
   }
  };

  module.exports.isreviewauthor = async (req, res, next) => {
     let { id, reviewId } = req.params;
    let review = await reviews.findById(reviewId);
  if (!review || !review.author._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};
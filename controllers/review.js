const Listing = require("../model/listing.js"); 
const reviews = require("../model/reviews.js");


module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let  newreview = new reviews(req.body.review);
  newreview.author = req.user._id;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
  
};

module.exports.deletereview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await reviews.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted a review!');
  res.redirect(`/listings/${id}`);
};
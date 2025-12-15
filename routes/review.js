const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/warpAsync.js");
const { validatereview, isLoggedin,isreviewauthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// reviews routes
router.post("/listings/:id/reviews",isLoggedin, validatereview, wrapAsync(reviewController.createreview));

// delete review route  
router.delete("/listings/:id/reviews/:reviewId", isLoggedin,isreviewauthor,wrapAsync( reviewController.deletereview));

module.exports = router;
 const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/warpAsync.js");
const { isLoggedin,isowner,validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });




// index route
router.get("/listings", wrapAsync(listingController.index));

// new route
router.get("/listings/new", isLoggedin, listingController.renderNewForm);

// show route
router.get("/listings/:id", wrapAsync(listingController.showlisting));

// create route
router.post("/listings", upload.single("listing[image]"), isLoggedin, validatelisting, wrapAsync(listingController.createListing));

// edit route
router.get("/listings/:id/edit", isLoggedin, isowner, wrapAsync(listingController.editListing));

// update route
router.put("/listings/:id", isLoggedin, isowner, upload.single("listing[image]"), validatelisting, wrapAsync(listingController.updateListing));

// delete route
router.delete("/listings/:id", isLoggedin, isowner, wrapAsync( listingController.deleteListing));

module.exports = router;
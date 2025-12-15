const Listing = require("../model/listing.js"); 
const axios = require("axios");



module.exports.index = async (req, res) => {
   const alllistings = await Listing.find({});
   res.render("listings/index", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const listings = await Listing.findById(id)
    .populate("owner")
    .populate("reviews");
  if (!listings) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }
  res.render("listings/show", { 
    listings, 
    currentUser: req.user,
    mapToken: process.env.MAP_API_KEY 
  });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    // Combine location and country for better geocoding
    const locationQuery = `${newlisting.location}, ${newlisting.country}`;

    try {
        const response = await axios.get(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json`,
            {
                params: {
                    key: process.env.MAP_API_KEY
                }
            }
        );

        if (response.data.features && response.data.features.length > 0) {
            const coords = response.data.features[0].geometry.coordinates;
            newlisting.geometry = {
                type: 'Point',
                coordinates: coords // [longitude, latitude]
            };
        }
    } catch (e) {
        console.log("Geocoding error:", e.message);
        // Continue even if geocoding fails
    }

    await newlisting.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  // Combine location and country for geocoding
  const locationQuery = `${listing.location}, ${listing.country}`;

  try {
    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json`,
      {
        params: {
          key: process.env.MAP_API_KEY
        }
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      const coords = response.data.features[0].geometry.coordinates;
      listing.geometry = {
        type: 'Point',
        coordinates: coords // [longitude, latitude]
      };
    }
  } catch (e) {
    console.log("Geocoding error:", e.message);
    // Continue even if geocoding fails
  }

  await listing.save();
  req.flash('success', 'Successfully updated a listing!');
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
      req.flash('error', 'Cannot find that listing!');
      return res.redirect('/listings');
    } 
    res.render("listings/edit", { listings });
};

module.exports.deleteListing =async (req, res) => {
  let { id } = req.params;
 await Listing.findByIdAndDelete(id);
 req.flash('success', 'Successfully deleted a listing!');
  res.redirect("/listings");
};


const mongoose = require('mongoose');
const reviews = require('./reviews');
const schema = mongoose.Schema;

const listingschema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:
        {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    GeometryLocation: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
});

listingschema.post("findOneAndDelete", async (listing) => {
    if(listing) {
    await reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});



const Listing = mongoose.model("listing",listingschema);
module.exports = Listing;
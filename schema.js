const joi = require("joi");

//sever side validation using joi

module.exports.listingschema = joi.object({
    listing: joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.string().allow('', null),
  price: joi.number().min(0).required(),
  country: joi.string().required(),
  location: joi.string().required()
    }).required()
});

module.exports.reviewschema = joi.object({
  review: joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
  }).required()
});
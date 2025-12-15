const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../model/listing");

main()
.then(()=>{console.log("successful")})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  
}   
 const initdb = async ()=> {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj,owner:"6929bc68f597c5526cb28aee"}));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
 };

 initdb();
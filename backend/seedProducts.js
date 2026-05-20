require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./model/product");
const products = require("./data/productsData");

const seedProducts = async () => {
  // check if mongo uri is there
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not found in .env file");
    return;
  }

  // check products count
  if (products.length < 50) {
    console.log("need at least 50 products, only found " + products.length);
    return;
  }

  // connect to database
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to mongodb");

  // loop through all products and save them one by one
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // check if product already exists
    const existing = await Product.findOne({ name: product.name });

    if (existing) {
      // product found, update it
      await Product.updateOne({ name: product.name }, { $set: product });
      updated++;
    } else {
      // product not found, create new one
      const newProduct = new Product(product);
      await newProduct.save();
      inserted++;
    }
  }

  // count total products in db
  const total = await Product.countDocuments();

  console.log("seeding done!");
  console.log("inserted: " + inserted);
  console.log("updated: " + updated);
  console.log("total products in db: " + total);
};

// run the function
seedProducts()
  .then(async () => {
    await mongoose.disconnect();
    console.log("disconnected from mongodb");
    process.exit(0);
  })
  .catch(async (error) => {
    console.log("something went wrong: " + error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
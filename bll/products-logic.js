const mongoose = require("mongoose");

// -------------------------------------------------------------
// Connect to the database: 
mongoose.connect("mongodb://localhost:27017/Northwind",

// The old server discovery and monitoring method is now deprecated - yet still default
// In order to use the new method, we pass a parameter:
// useUnifiedTopology: true
    { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("We're connected to " + mongoClient.name + " database on MongoDB...");
    });

// -------------------------------------------------------------
// Create category schema: 
// THE NAMES MUST (!) BE IDENTICAL TO THE ONES IN THE DB (MONGO) 
const categorySchema = mongoose.Schema({
    name: String,
    description: String
    // Disable the automatic mechanism which saves a version to each document
    // The version key is only being updated when the user calls save()
}, { versionKey: false });

// Create category model: 
// Parameters : Model logical name(we decide) , schema object, collectionsName
const Category = mongoose.model("Category", categorySchema, "categories");
// -------------------------------------------------------------
// Create a schema for a product:
// THE NAMES MUST (!) BE IDENTICAL TO THE ONES IN THE DB (MONGO) 
const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    // ref: "Category reffers to the "category" model name called "Category"
    productCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // Relation = Foreight Key
}, { versionKey: false });

// Create a product model
// Parameters : Model logical name(we decide) , schema object, collectionsName
const Product = mongoose.model("Product", productSchema, "products"); // Model, Schema, Collection
// -------------------------------------------------------------

// Extracting all the products, the category will only 
// Populate is like join
// Populated paths are replaced with the mongoose doucment 
// returned from the DB, by performing a seperate query
function getAllProducts() {
    return new Promise((resolve, reject) => {
        // Populate includes the category object inside each product object: 
        // Similar to cascade on find in Java (JPA)
        Product.find({}).populate("productCategory").exec((err, products) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(products);
        });
    });
}

function getOneProduct(_id) {
    return new Promise((resolve, reject) => {
        Product.findById(_id, (err, product) => {
            if (err) return reject(err);
            resolve(product);
        });
    });
}

// If we provide an object which is a product that contains a category (a new one)
// Where's the bug ?
function addProduct(product) {
    return new Promise((resolve, reject) => {
        const prod = new Product(product);
        prod.save((err, prod) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(prod);
        });
    });
    
}

function updateProduct(product) {
    return new Promise((resolve, reject) => {
        const prod = new Product(product);
        // All the top level keys are set as $set operations
        Product.updateOne({ _id: product._id }, prod, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(prod);
        });
    });
}



function deleteProduct(_id) {
    return new Promise((resolve, reject) => {
        Product.deleteOne({ _id }, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct,
};
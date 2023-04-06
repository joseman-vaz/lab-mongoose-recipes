const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://0.0.0.0:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    Recipe.create({
      title: "tacos",
      level: "Easy Peasy",
      ingredients: ["Tortilla", "Meat"],
      cuisine: "Mexican",
      dishType: "breakfast",
      duration: 30,
      creator: "Jose",
    })
      .then((recipe) => console.log(recipe.title))
      .catch((recipe) => console.log("An error happened"));
  })
  .then(() => {
    return Recipe.insertMany(data);
  })
  .then((recipe) => {
    return Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 },
      { new: true }
    );
  })
  .then((updatedRecipe) => {
    console.log(`Successfully updated the recipe: ${updatedRecipe.title}`);
  })
  .then((recipe) => {
    return Recipe.deleteOne({ title: "Carrot Cake" });
  })
  .then((deletedRecipe) => {
    console.log(`Successfully deleted the recipe: ${deletedRecipe.title}`);
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

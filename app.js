
//Require All Modules
const express = require("express");

const mongoose = require("mongoose");

const ejs = require("ejs");

const bodyParser = require("body-parser");

const app = express();



//Intialize body parser to help make post requests 
app.use(bodyParser.urlencoded({ extended: true }));

// Intialize view engine as EJS 
app.set("view engine", "ejs");

app.use(express.static("public"));

//Connect MongoDb Database with NodeJS
mongoose.connect("mongodb://localhost:27017/WikiDB");


//Create the schema for the database
const wikiSchema = new mongoose.Schema(
  {
    name: String,
    content: String,
  },
  {
    versionKey: false,
  }
);

const Article = mongoose.model("Article", wikiSchema);


//Set up the route for making get,post and delete requests 
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, data) {
      console.log(data)
      res.send(data);
    });
  })
  .post(function (req, res) {
    const article = new Article({
      name: req.body.name,
      content: req.body.content,
    });
    article.save(function (err) {
      if (err) res.send(err);
      else res.send("Added a new article through POST request");
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      res.send("Sucesfully deleted all the items");
    });
  });


//Making GET, PUT,PATCH and DELETE requests using id of article 
app
  .route("/articles/:articleID")
  .get(function (req, res) {
    const articleID = req.params.articleID;
    console.log(articleID);
    Article.findOne({ _id: articleID }, function (err, data) {
      if (err) res.send("No articles matching");
      else res.send(data);
    });
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { _id: req.params.articleID },
      { name: req.body.name, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (err) res.send(err);
        else res.send("Sucesfully updated article");
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { _id: req.params.articleID },
      { $set: req.body },
      function (err) {
        if (err) res.send(err);
        else res.send("Updated");
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ _id: req.params.articleID }, function (err) {
      if (err) console.log(err);
      else res.send("Deleted!!");
    });
  });


app.listen(5000, function () {
  console.log("Server started on port 5000");
});

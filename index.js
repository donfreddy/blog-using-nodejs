const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const routes = require("./routes/blog-router.js");
const PORT = process.env.PORT || 8080;

const app = express();

app.set("view engine", "ejs");

const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

app.use(routes);

app.listen(8080, () => {
  console.log(`Allez à cette adresse: http://localhost:${PORT}`);
});

/* Connect to MongoDB */
mongoose
  .connect("mongodb://localhost:27017/blog-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Vous êtes maintenant connecté à Mongo!"))
  .catch((err) => console.error("Quelque chose a mal tourné", err));

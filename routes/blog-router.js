const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
  let query = "SELECT * FROM  blog_app.posts ORDER BY id ASC";

  db.query(query, (err, rows) => {
    if (err) throw err;
    console.log("The data from posts table are: \n", rows);
    res.render("pages/home", { posts: rows });
  });
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/post/:id", (req, res) => {
  let postId = req.params.id;
  let query = "SELECT * FROM `posts` WHERE id = '" + postId + "' ";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("pages/post", { post: result[0] });
  });
});

router.get("/edit/:id", (req, res) => {
  let postId = req.params.id;
  let query = "SELECT * FROM `posts` WHERE id = '" + postId + "' ";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("pages/edit", { post: result[0] });
  });
});

router.post("/edit/:id", (req, res) => {
  let postId = req.params.id;
  let username = req.body.username;
  let title = req.body.title;
  let description = req.body.description;
  let content = req.body.content;

  let query =
    "UPDATE `posts` SET `user_name` = '" +
    username +
    "', `title` = '" +
    title +
    "', `description` = '" +
    description +
    "', `content` = '" +
    content +
    "' WHERE `posts`.`id` = '" +
    postId +
    "'";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/");
  });
});

router.get("/delete/:id", (req, res) => {
  let postId = req.params.id;
  let getImageQuery = 'SELECT image from `posts` WHERE id = "' + postId + '"';
  let deletePostQuery = 'DELETE FROM posts WHERE id = "' + postId + '"';

  db.query(getImageQuery, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    let image = result[0].image;

    fs.unlink(`public/posts/${image}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      db.query(deletePostQuery, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.redirect("/");
      });
    });
  });
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

router.get("/posts/new", (req, res) => {
  res.render("pages/create");
});

router.post("/posts/store", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  let username = req.body.username;
  let title = req.body.title;
  let description = req.body.description;
  let content = req.body.content;
  let createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  let uploadedFile = req.files.image;
  let image_name = uploadedFile.name;
  let fileExtension = uploadedFile.mimetype.split("/")[1];

  // check the filetype before uploading it
  if (
    uploadedFile.mimetype === "image/png" ||
    uploadedFile.mimetype === "image/jpeg" ||
    uploadedFile.mimetype === "image/gif"
  ) {
    // upload the file to the /public/assets/img directory
    uploadedFile.mv(`public/posts/${image_name}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // send posts to the database
      let query = `INSERT INTO posts (user_name, title, description, content, image, createdAt) VALUES ('${username}', '${title}', '${description}', '${content}', '${image_name}', '${createdAt}')`;

      // execute query
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.redirect("/");
      });
    });
  } else {
    let message =
      "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";

    res.render("pages/create", { message: message });
  }
});

module.exports = router;

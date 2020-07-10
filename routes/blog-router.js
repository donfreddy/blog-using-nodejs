const express = require("express");
const router = express.Router();
const Post = require("../database/models/post");

router.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("pages/home", { posts: posts });
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("pages/post", { post: post });
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

router.get("/posts/new", (req, res) => {
  res.render("pages/create");
});

router.post("/posts/store", (req, res) => {
  const { image } = req.files;

  image.mv(path.resolve(__dirname, "public/posts", image.name), (error) => {
    Post.create(
      {
        ...req.body,
        image: `/posts/${image.name}`,
      },
      (error, post) => {
        res.redirect("/");
      }
    );
  });
});

module.exports = router;

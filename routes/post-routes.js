const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file-storage");

const router = express.Router();

const PostController = require("../controllers/post.controller");


// HTTP GET - to fetch all posts
router.get("", PostController.getPosts);

// HTTP GET - to fetch a single post based on id
router.get("/:id", PostController.getPost);

// HTTP POST - to create a new post
router.post("", checkAuth, extractFile, PostController.createPost);

// HTTP DELETE - to delete a post
router.delete("/:id", checkAuth, PostController.deletePost);

// HTTP PUT - to update an existing post
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

module.exports = router;
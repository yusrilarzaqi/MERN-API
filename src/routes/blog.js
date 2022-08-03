// import module
const express = require("express");
const { body } = require("express-validator");

// constant
const router = express.Router();

// controller
const blogController = require("../controllers/blog");

// [POST] -> /v1/blog/post
router.post(
	"/post",
	[
		body("title").isLength({ min: 5 }).withMessage("Input title tidak sesuai"),
		body("body").isLength({ min: 5 }).withMessage("Input body tidak sesuai"),
	],
	blogController.createBlogPost
);

// [GET] -> /v1/blog/post
//			 -> /v1/blog/post?page=1&perPage=5
router.get("/posts", blogController.getBlogPost);

// [GET] -> /v1/blog/post/{id}
router.get("/post/:postId", blogController.getBlogPostById);

// [PUT] -> /v1/blog/post/{id}
router.put(
	"/post/:postId",
	[
		body("title").isLength({ min: 5 }).withMessage("Input title tidak sesuai"),
		body("body").isLength({ min: 5 }).withMessage("Input body tidak sesuai"),
	],
	blogController.updateBlogPost
);

// [DELETE] -> /v1/blog/post/{id}
router.delete("/post/:postId", blogController.deleteBlogPost);

module.exports = router;

const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const path = require("path");
const fs = require("fs");

exports.createBlogPost = (req, res, next) => {
	// get error from validationResult
	const errors = validationResult(req);

	// if error then throw error
	if (!errors.isEmpty()) {
		const err = new Error("Input Value Tidak Sesuai");
		err.data = errors.mapped();
		err.statusCode = 400;
		throw err;
	}

	if (!req.file) {
		const err = new Error("Input Value Tidak Sesuai");
		err.data = "Extention file invalid";
		err.statusCode = 422;
		throw err;
	}

	// get data from req.body
	const { title, body } = req.body;
	const image = req.file.path;

	const Posting = new BlogPost({
		// add to database
		title,
		body,
		image,
		author: {
			uid: 1,
			name: "Yusril Arzaqi",
		},
	});
	// save to database
	Posting.save()
		.then((result) => {
			// response to clinet json with status code 201
			res.status(201).json({
				message: "Create Blog Post Success",
				data: result,
			});
		})
		.catch((err) => {
			console.error(err);
		});
};

exports.getBlogPost = (req, res, next) => {
	const currentPage = parseInt(req.query.page) || 1;
	const perPage = parseInt(req.query.perPage) || 5;
	let totalItems;

	BlogPost.find()
		.countDocuments()
		.then((count) => {
			totalItems = count;
			return BlogPost.find()
				.skip((currentPage - 1) * perPage)
				.limit(perPage);
		})
		.then((result) => {
			res.status(200).json({
				message: "Data Blog Post Berhasil dipanggil",
				data: result,
				total_data: totalItems,
				per_page: perPage,
				current_Page: currentPage,
			});
		})
		.catch((err) => next(err));
};

exports.getBlogPostById = (req, res, next) => {
	const id = req.params.postId;
	BlogPost.findById(id)
		.then((result) => {
			if (!result) {
				const error = new Error("Blog Post tidak ditemukan");
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				message: `Data Blog Post dengan id: ${id}`,
				data: result,
			});
		})
		.catch((err) => next(err));
};

exports.updateBlogPost = (req, res, next) => {
	// get error from validationResult
	const errors = validationResult(req);

	// if error then throw error
	if (!errors.isEmpty()) {
		const err = new Error("Input Value Tidak Sesuai");
		err.data = errors.mapped();
		err.statusCode = 400;
		throw err;
	}

	if (!req.file) {
		const err = new Error("Input Value Tidak Sesuai");
		err.data = "Extention file invalid";
		err.statusCode = 422;
		throw err;
	}

	// get data from req.body
	const { title, body } = req.body;
	const image = req.file.path;
	const postId = req.params.postId;

	BlogPost.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error("Blog Post tidak ditemukan");
				error.statusCode = 404;
				throw error;
			}

			post.title = title;

			post.body = body;
			post.image = image;
			return post.save();
		})
		.then((result) => {
			res.status(200).json({
				message: "Data Post Berhasil Diupdate",
				data: result,
			});
		})
		.catch((err) => next(err));
};

exports.deleteBlogPost = (req, res, next) => {
	const postId = req.params.postId;
	BlogPost.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error("Blog Post tidak ditemukan");
				error.statusCode = 404;
				throw error;
			}
			removeImage(post.image);
			return BlogPost.findByIdAndRemove(postId);
		})
		.then((result) => {
			res.status(200).json({
				message: "Delete Blog Post Successfully",
				data: result,
			});
		})
		.catch((error) => next(error));
};

const removeImage = (filePath) => {
	filePath = path.join(__dirname, "../../", filePath);
	fs.unlink(filePath, (err) => console.log(err));
};

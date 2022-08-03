// Import module
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { DB_PASSWORD } = require("dotenv").config({ path: "./.env" }).parsed;
const multer = require("multer");
const path = require("path");

// Constant
const app = express();
const PORT = 8080;
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + "-" + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	file.mimetype === "image/png" ||
	file.mimetype === "image/jpg" ||
	file.mimetype === "image/jpeg"
		? cb(null, true)
		: cb(null, false);
};

// Routes
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// middleware
app.use(
	multer({
		storage: fileStorage,
		fileFilter,
	}).single("image")
);
app.use(bodyParser.json()); // tipe JSON
app.use("/images", express.static(path.join(__dirname + "/images")));
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Method",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

// endpoint
app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

// error handling
app.use((error, req, res, next) => {
	res.status(error.statusCode || 500).json({
		message: error.message,
		data: error.data,
	});
});

// connect to mongodb
mongoose
	.connect(
		`mongodb+srv://yusrilarzaqi:${DB_PASSWORD}@cluster0.2aiur.mongodb.net/blog?retryWrites=true&w=majority`
	)
	.then(() => {
		// start server to port 8080
		app.listen(PORT, () =>
			console.log(`server listen to port http://127.0.0.1:${PORT}`)
		);
	})
	// if connection error
	.catch((err) => console.error(err));

exports.register = (req, res, next) => {
	const { name, email, password } = req.body;
	res.status(201).json({
		message: 'Register Successfully',
		data: {
			uid: 1,
			name,
			email,
			password,
		},
	});
};

exports.login = (req, res, next) => {
	const { email, password } = req.body;
	res.status(200).json({
		message: 'Login Successfully',
		data: {
			uid: 1,
			email,
			password,
		},
	});
};

const express = require('express');

const app = express();

app.use(() => {
	console.log('Hello world');
	console.log('Hello world 1');
	console.log('Hello world 2');
});
app.listen(8080);

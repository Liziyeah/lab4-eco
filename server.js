const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

const db = {
	users: [],
	posts: [],
};

// Setup
app.use(express.json());
app.use(cors());

// Views
app.use('/', express.static('./views/home'));
app.use('/auth/login', express.static('./views/login'));
app.use('/auth/register', express.static('./views/register'));
app.use('/view/', express.static('./views/view'));
app.use('/posts/create', express.static('./views/create-post'));

// API
app.get('/api/users', (_, res) => {
	const users = db.users.map((user) => ({
		username: user.username,
		name: user.name,
	}));

	res.json(users);
});
app.get('/api/posts', (_, res) => {
	res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
	const { username, name, url, title, description } = req.body;

	if (!username || !name || !url || !title || !description) {
		return res.status(400).json({ message: 'Campos obligatorios.' });
	}

	db.posts.push({ username, name, url, title, description });

	res.status(201).json({ message: 'El post se creó con éxito.' });
});

app.post('/api/auth/register', (req, res) => {
	const { username, name, password } = req.body;

	if (!username || !name || !password) {
		return res.status(400).json({ message: 'Campos obligatorios.' });
	}

	const userExists = db.users.some((user) => user.username === username);

	if (userExists) {
		return res.status(400).json({ message: 'Usuario existente.' });
	}

	db.users.push({ username, name, password });

	res.status(201).json({ message: 'Usuario registrado con éxito.' });
});

app.post('/api/auth/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'Campos obligatorios.' });
	}

	const user = db.users.find(
		(user) => user.username === username && user.password === password
	);

	if (!user) {
		return res.status(401).json({ message: 'Datos incorrectos.' });
	}

	res.json({ username, name: user.name });
});

// holaaaa
app.use((_, res) => {
	res.json({
		message: 'Page not found',
	});
});

// Server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

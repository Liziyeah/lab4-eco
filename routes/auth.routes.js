const express = require('express');
const router = express.Router();


let db;
let socketService;


const initAuthRoutes = (database, socket) => {
  db = database;
  socketService = socket;
  return router;
};
router.post('/api/auth/register', (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ message: 'Campos obligatorios.' });
  }

  const userExists = db.users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: 'Usuario existente.' });
  }

  db.users.push({ username, name, password });
  socketService.emitEvent('new-user', { username, name });

  res.status(201).json({ message: 'Usuario registrado con éxito.' });
});

router.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Campos obligatorios.' });
  }

  const user = db.users.find(
    user => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Datos incorrectos.' });
  }

  socketService.emitEvent('user-login', { username, name: user.name });

  res.json({ username, name: user.name });
});

module.exports = initAuthRoutes;

const express = require('express');
const router = express.Router();

let db;
let socketService;

const initPostRoutes = (database, socket) => {
  db = database;
  socketService = socket;
  return router;
};


router.get('/api/posts', (_, res) => {
  res.json(db.posts);
});
router.post('/api/posts', (req, res) => {
  const { username, name, url, title, description } = req.body;

  if (!username || !name || !url || !title || !description) {
    return res.status(400).json({ message: 'Campos obligatorios.' });
  }

  const newPost = { username, name, url, title, description };
  db.posts.push(newPost);

  socketService.emitEvent('new-post', newPost);

  res.status(201).json({ message: 'El post se creó con éxito.' });
});

module.exports = initPostRoutes;
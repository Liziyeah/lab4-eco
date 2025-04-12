const express = require('express');
const router = express.Router();

let db;
const initUserRoutes = (database) => {
  db = database;
  return router;
};

router.get('/api/users', (_, res) => {
  const users = db.users.map(user => ({
    username: user.username,
    name: user.name
  }));
  
  res.json(users);
})

module.exports = initUserRoutes;

//Ecogram con nueva arquitectura
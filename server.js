const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = 8080;

const db = {
  users: [],
  posts: [],
};

app.use(express.json());
app.use(cors());

const socketService = require('./services/socket.service');
socketService.initSocketInstance(server);

const initUserRoutes = require('./routes/user.routes');
const initPostRoutes = require('./routes/posts.routes');
const initAuthRoutes = require('./routes/auth.routes');

app.use(initUserRoutes(db));
app.use(initPostRoutes(db, socketService));
app.use(initAuthRoutes(db, socketService));

app.use('/', express.static('./views/home'));
app.use('/auth/login', express.static('./views/login'));
app.use('/auth/register', express.static('./views/register'));
app.use('/view/', express.static('./views/view'));
app.use('/posts/create', express.static('./views/create-post'));

app.use((_, res) => {
  res.json({
    message: 'Page not found',
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Socket.IO configurado con la ruta: /real-time`);
});
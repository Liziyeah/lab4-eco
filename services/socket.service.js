let io;

const initSocketInstance = (httpServer) => {
  const { Server } = require('socket.io');
  io = new Server(httpServer, {
    path: '/real-time',
    cors: {
      origin: '*'
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};

const emitEvent = (eventName, data) => {
  if (!io) {
    console.error('Socket.IO no ha sido inicializado');
    return;
  }
  io.emit(eventName, data);
};

module.exports = {
  initSocketInstance,
  emitEvent
};
import { Server } from 'socket.io';
import { socketServerToken } from '../config';

export default class SocketServer {
  constructor(io: Server) {
    this.config(io);
  }

  public config(io: Server): void {
    const ticketNotificationNamespace = io.of('/ticket-notification');
    // Authentication middleware
    ticketNotificationNamespace.use(function (socket, next) {
      if (socket.handshake.auth.token == socketServerToken) {
        console.log(socket.handshake.auth.token == socketServerToken);
        next();
      } else {
        console.log('Unauthorized user @' + socket.id);
        socket.emit('connection rejected', 'Unauthorized');
        socket.disconnect(true);
        next(new Error('Authentication error'));
      }
    });
    ticketNotificationNamespace.on('connection', async (socket) => {
      console.log(`Got a new client [@${socket.id}]`);
      socket.on('disconnect', function (reason) {
        console.log('Got a disconnect @', socket.id);
        console.log(`reason => ${reason}`);
      });
    });
  }
}

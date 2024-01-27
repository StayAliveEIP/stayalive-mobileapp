// WebSocketService.js
import io from 'socket.io-client';
import { urlApi } from 'Utils/Api';

const SOCKET_URL = `${urlApi}/rescuer/ws`;

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(SOCKET_URL, {
      query: { token: `Bearer ${token}` },
    });

    this.socket.on('message', (emergency) => {
      console.log('Emergency Received:', emergency);

    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;

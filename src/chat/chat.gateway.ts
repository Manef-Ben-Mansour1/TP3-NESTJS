import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clientId = null;

  handleConnection(client: any, ...args: any[]) {
    this.clientId = client.id;
    client.emit('user-joined', { text: `connected: ${client.id}` });
  }

  handleDisconnect(client: any) {
    client.broadcast.emit('user-left', { text: `disconnected: ${client.id}` });
  }

  @SubscribeMessage('like-message')
  handleLikeMessage(client: Socket, payload: any): void {
    this.server.emit('like-message', payload);
  }

  @SubscribeMessage('emoji-message')
  handleEmojiMessage(client: Socket, payload: any): void {
    this.server.emit('emoji-message', payload);
  }

  @SubscribeMessage('comment-message')
  handleCommentMessage(client: Socket, payload: any,): void {
    this.server.emit('comment-message', payload);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string,@ConnectedSocket() client: Socket): void {
    this.server.emit('message', { message, client: client.id });
  }
}

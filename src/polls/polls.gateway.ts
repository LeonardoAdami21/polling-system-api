import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsService } from './polls.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PollsGateway {
  constructor(private readonly pollsService: PollsService) {}

  @WebSocketServer()
  server: Server;

  private connectedClients = 0;

  handleConnection() {
    this.connectedClients++;
    console.log(`Client connected: ${this.connectedClients} clients connected`);
  }

  handleDisconnect() {
    this.connectedClients--;
    console.log(
      `Client disconnected: ${this.connectedClients} clients connected`,
    );
  }

  @SubscribeMessage('createPoll')
  create(@MessageBody() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }

  @SubscribeMessage('joinPoll')
  async handleJoinPoll(client: Socket, pollId: string) {
    client.join(pollId);
    console.log(`Client joined poll room: ${pollId}`);

    // Send current poll data to the client
    const pollData = await this.pollsService.findOne(pollId);
    client.emit('pollData', pollData);
  }

  @SubscribeMessage('leavePoll')
  handleLeavePoll(client: Socket, pollId: string) {
    client.leave(pollId);
    console.log(`Client left poll room: ${pollId}`);
  }

  @SubscribeMessage('findAllPolls')
  findAll() {
    return this.pollsService.findAll();
  }

  @SubscribeMessage('findOnePoll')
  findOne(@MessageBody() id: string) {
    return this.pollsService.findOne(id);
  }

  async broadcastPollUpdate(pollId: string) {
    const updatedPoll = await this.pollsService.findOne(pollId);
    this.server.to(pollId).emit('pollUpdate', updatedPoll);
  }

  // Call this method from the poll service after a vote is cast
  async notifyVote(pollId: string) {
    await this.broadcastPollUpdate(pollId);
  }
}

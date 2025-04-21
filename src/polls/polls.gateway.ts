import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollsService } from './polls.service';

@WebSocketGateway()
export class PollsGateway {
  constructor(private readonly pollsService: PollsService) {}

  @SubscribeMessage('createPoll')
  create(@MessageBody() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }

  @SubscribeMessage('findAllPolls')
  findAll() {
    return this.pollsService.findAll();
  }

  @SubscribeMessage('findOnePoll')
  findOne(@MessageBody() id: string) {
    return this.pollsService.findOne(id);
  }

}

import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsGateway } from './polls.gateway';
import { PrismaModule } from '../config/prisma.module';
import { pollsProvider } from './provider/poll.provider';
import { PollRepository } from './prisma/poll.repository';
import { votesProvider } from './provider/vote.provider';
import { VoteRepository } from './prisma/vote.repository';
import { PollsController } from './polls.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PollsController],
  providers: [
    PollsGateway,
    PollsService,
    ...pollsProvider,
    ...votesProvider,
    PollRepository,
    VoteRepository,
  ],
  exports: [PollsService, PollsGateway],
})
export class PollsModule {}

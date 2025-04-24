import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VOTE__REPOSITORY } from '../provider/vote.provider';
import { PrismaClient } from '@prisma/client';
import { VoteDto } from '../dto/create-vote.dto';
import { PollRepository } from './poll.repository';
import { PollsService } from '../polls.service';

@Injectable()
export class VoteRepository {
  constructor(
    @Inject(VOTE__REPOSITORY)
    private readonly voteRepository: PrismaClient['vote'],
    @Inject(forwardRef(() => PollsService))
    private readonly pollService: PollsService,
  ) {}

  async create(dto: VoteDto, pollId: string, voterIp?: string) {
    try {
      const poll = await this.pollService.findOne(pollId);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      const existingVote = await this.voteRepository.findUnique({
        where: {
          pollId_voterIp: {
            pollId,
            voterIp,
          },
        },
      });

      if (existingVote) {
        throw new BadRequestException('User has already voted');
      }
      const vote = await this.voteRepository.create({
        data: {
          optionId: dto.optionId,
          pollId,
          voterIp: voterIp,
        },
        include: {
          option: true,
          poll: true,
        },
      });
      return vote;
    } catch (error) {
      throw new InternalServerErrorException('Error creating vote' + error);
    }
  }

  async update(dto: VoteDto, pollId: string, voterIp?: string) {
    try {
      const poll = await this.pollService.findOne(pollId);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      const vote = await this.voteRepository.update({
        where: {
          pollId,
          optionId: dto.optionId,
          pollId_voterIp: {
            pollId,
            voterIp,
          },
        },
        data: {
          optionId: dto.optionId,
        },
      });
      return {
        ...vote,
        option: poll.options.find((option) => option.id === dto.optionId),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating vote' + error);
    }
  }
}

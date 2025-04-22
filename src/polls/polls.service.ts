import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollRepository } from './prisma/poll.repository';

@Injectable()
export class PollsService {
  constructor(
    private readonly pollRepository: PollRepository,
  ) {}
  async create(createPollDto: CreatePollDto) {
    try {
      const poll = await this.pollRepository.create(createPollDto);
      return poll;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const polls = await this.pollRepository.findAll();
      return polls;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const poll = await this.pollRepository.findOne(id);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      return poll;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async votePoll(pollId: string, dto: any, voterIp?: string) {
    try {
      const poll = await this.pollRepository.findOne(pollId);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      const vote = await this.pollRepository.votePoll(pollId, dto, voterIp);
      return vote;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPollResults(pollId: string) {
    try {
      const poll = await this.pollRepository.findOne(pollId);
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      const pollResults = await this.pollRepository.getPollResults(pollId);
      return pollResults;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

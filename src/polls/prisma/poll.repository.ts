import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { POLL__REPOSITORY } from '../provider/poll.provider';
import { PrismaClient } from '@prisma/client';
import { CreatePollDto } from '../dto/create-poll.dto';
import { VoteDto } from '../dto/create-vote.dto';
import { VoteRepository } from './vote.repository';

@Injectable()
export class PollRepository {
  constructor(
    @Inject(POLL__REPOSITORY)
    private readonly pollRepository: PrismaClient['poll'],
    private readonly voteRepository: VoteRepository,
  ) {}

  async create(dto: CreatePollDto) {
    try {
      const { title, description, options } = dto;
      if (!title || !description) {
        throw new BadRequestException('Invalid poll data');
      }
      const poll = await this.pollRepository.create({
        data: {
          title,
          description,
          options: {
            create: options.map((option) => ({ text: option.text })),
          },
        },
        include: {
          options: true,
        },
      });

      return poll;
    } catch (error) {
      throw new InternalServerErrorException('Error creating poll' + error);
    }
  }

  async findAll() {
    try {
      const polls = await this.pollRepository.findMany({
        include: {
          options: true,
          votes: true,
        },
      });

      return polls;
    } catch (error) {
      throw new InternalServerErrorException('Error finding polls' + error);
    }
  }

  async findById(id: string) {
    try {
      const poll = await this.pollRepository.findUnique({
        where: {
          id: id,
        },
        include: {
          options: {
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      return poll;
    } catch (error) {
      throw new InternalServerErrorException('Error finding poll' + error);
    }
  }

  async findOne(pollId: string) {
    try {
      const poll = await this.pollRepository.findUnique({
        where: {
          id: pollId,
        },
        include: {
          options: {
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
      if (!poll) {
        throw new NotFoundException('Poll not found');
      }
      const formattedOptions = poll.options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option._count.votes,
      }));
      const totalVotes = formattedOptions.reduce(
        (sum, option) => sum + option.votes,
        0,
      );
      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        createdAt: poll.createdAt,
        options: formattedOptions,
        totalVotes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error finding poll' + error);
    }
  }

  async votePoll(pollId: string, dto: VoteDto, voterIp?: string) {
    try {
      const poll = await this.pollRepository.findUnique({
        where: {
          id: pollId,
        },
        include: {
          options: true,
        },
      });
      if (!poll) {
        throw new NotFoundException('Poll not found with id: ' + pollId);
      }

      const optionExists = poll.options.some(
        (option) => option.id === dto.optionId,
      );
      if (!optionExists) {
        throw new NotFoundException(
          'Option not found with id: ' + dto.optionId,
        );
      }

      const vote = await this.voteRepository.create(dto, pollId, voterIp);
      return vote;
    } catch (error) {
      if (error.code === 'P2002') {
        await this.voteRepository.update(dto, pollId, voterIp);
      } else {
        throw new InternalServerErrorException('Error voting' + error);
      }
      return await this.findOne(pollId);
    }
  }

  async getPollResults(pollId: string) {
    return await this.findOne(pollId);
  }
}

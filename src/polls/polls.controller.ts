import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/create-vote.dto';

@Controller('polls')
@ApiTags('Polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @ApiOperation({ summary: 'Create a new poll' })
  @ApiCreatedResponse({
    description: 'The poll has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid poll data' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  @Post()
  async create(@Body() dto: CreatePollDto) {
    return this.pollsService.create(dto);
  }

  @ApiOperation({ summary: 'Vote on a poll' })
  @ApiCreatedResponse({
    description: 'The poll has been successfully created.',
  })
  @ApiNotFoundResponse({ description: 'Poll not found' })
  @ApiBadRequestResponse({ description: 'Invalid poll data' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'voterIp', type: String })
  @Post(':id/vote/:voterIp')
  async votePoll(
    @Param('id') pollId: string,
    @Body() dto: VoteDto,
    @Param('voterIp') voterIp: string,
  ) {
    return this.pollsService.votePoll(pollId, dto, voterIp);
  }

  @ApiOperation({ summary: 'Get all polls' })
  @ApiOkResponse({ description: 'The poll has been successfully created.' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  @Get()
  async findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a poll by id' })
  @ApiOkResponse({ description: 'The poll has been successfully created.' })
  @ApiNotFoundResponse({ description: 'Poll not found' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  async findOne(id: string) {
    return this.pollsService.findOne(id);
  }
}

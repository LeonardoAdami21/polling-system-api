import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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
import { Request } from 'express';

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
    description: 'The vote has been successfully submitted on a poll.',
  })
  @ApiNotFoundResponse({ description: 'Poll not found' })
  @ApiBadRequestResponse({ description: 'Invalid poll data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiParam({ name: 'pollId', type: String })
  @Post(':pollId/vote')
  async votePoll(
    @Param('pollId') pollId: string,
    @Body() dto: VoteDto,
    @Req() request: Request,
  ) {
    const voterIp = request.ip || 'unknown';
    return this.pollsService.votePoll(pollId, dto, voterIp);
  }

  @ApiOperation({ summary: 'Get poll results' })
  @ApiOkResponse({ description: 'Returns poll results' })
  @ApiNotFoundResponse({ description: 'Poll not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiParam({ name: 'pollId', type: String })
  @Get(':pollId/results')
  getPollResults(@Param('pollId') pollId: string) {
    return this.pollsService.getPollResults(pollId);
  }

  @ApiOperation({ summary: 'Get all polls' })
  @ApiOkResponse({ description: 'The poll has been successfully created.' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  @Get()
  async findAll() {
    return this.pollsService.findAll();
  }

  @Get(':pollId')
  @ApiOperation({ summary: 'Get a poll by id' })
  @ApiOkResponse({ description: 'The poll has been successfully created.' })
  @ApiNotFoundResponse({ description: 'Poll not found' })
  @ApiInternalServerErrorResponse({ description: 'Error creating poll' })
  async findOne(@Param('pollId') pollId: string) {
    return this.pollsService.findOne(pollId);
  }
}

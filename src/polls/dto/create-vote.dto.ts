// src/polls/dto/vote.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Id da opção',
    example: '11111111-1111-1111-1111',
  })
  @IsNotEmpty()
  optionId: string;
}

// src/polls/dto/create-poll.dto.ts
import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Opção',
    example: 'Opção 1',
  })
  @IsNotEmpty()
  text: string;
}

export class CreatePollDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Título do poll',
    example: 'Título do poll',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Descrição do poll',
    example: 'Descrição do poll',
  })
  @IsString()
  description?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ApiProperty({
    type: [CreateOptionDto],
    description: 'Opções do poll',
    example: [{ text: 'Opção 1' }, { text: 'Opção 2' }],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

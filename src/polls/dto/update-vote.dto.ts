import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoteDto {
  @ApiProperty({
    type: String,
    description: 'Id da opção',
    example: '11111111-1111-1111-1111',
  })
  optionId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createFriendto {
  @IsNotEmpty()
  @ApiProperty({ description: '친구신청 보낸 사용자' })
  senderId: number;

  @IsNotEmpty()
  @ApiProperty({ description: '친구신청 받은 사용자' })
  receiverId: number;
}

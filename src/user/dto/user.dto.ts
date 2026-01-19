import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  name: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'hong@example.com',
  })
  email: string;

  @ApiProperty({ description: '생성자', example: 'admin' })
  createUser: string;

  @ApiProperty({ description: '수정자', example: 'admin' })
  updateUser: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '사용자 이메일',

    example: 'hong@example.com',

    required: false,
  })
  email?: string;

  @ApiProperty({ description: '수정자', example: 'admin', required: false })
  updateUser?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  name: string;
  @ApiProperty({
    description: '사용자 이메일',
    example: 'hong@example.com',
  })
  email: string;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '생성자', example: 'admin' })
  createUser: string;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;

  @ApiProperty({ description: '수정자', example: 'admin' })
  updateUser: string;
}

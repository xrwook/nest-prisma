import { Controller, Get, Param } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 조회' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자를 성공적으로 조회했습니다.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.userService.getUserById(id);
  }
}

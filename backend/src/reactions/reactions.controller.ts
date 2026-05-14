import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { ReactionType } from '@prisma/client';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

class ReactDto {
  @IsEnum(ReactionType)
  type!: ReactionType;
}

@UseGuards(JwtAuthGuard)
@Controller('reviews/:reviewId/react')
export class ReactionsController {
  constructor(private readonly reactions: ReactionsService) {}

  @Post()
  react(@CurrentUser() user: AuthUser, @Param('reviewId') reviewId: string, @Body() dto: ReactDto) {
    return this.reactions.react(user.id, reviewId, dto.type);
  }

  @Delete()
  unreact(@CurrentUser() user: AuthUser, @Param('reviewId') reviewId: string) {
    return this.reactions.unreact(user.id, reviewId);
  }
}

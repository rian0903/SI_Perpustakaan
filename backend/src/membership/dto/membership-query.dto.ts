import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus } from '@prisma/client';

export class MembershipQueryDto {
  @IsOptional()
  @IsEnum(MembershipStatus, { message: 'Status tidak valid.' })
  status?: MembershipStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;
}

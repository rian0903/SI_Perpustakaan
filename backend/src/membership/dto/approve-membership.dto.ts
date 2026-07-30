import { IsString, IsOptional } from 'class-validator';

export class ApproveMembershipDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

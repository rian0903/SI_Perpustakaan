import { IsString, IsNotEmpty } from 'class-validator';

export class RejectMembershipDto {
  @IsString()
  @IsNotEmpty({ message: 'Alasan penolakan wajib diisi.' })
  rejectionReason!: string;
}

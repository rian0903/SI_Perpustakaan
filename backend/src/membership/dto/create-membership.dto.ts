import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi.' })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis kelamin wajib diisi.' })
  gender!: string;

  @IsString()
  @IsOptional()
  birthPlace?: string;

  @IsDateString({}, { message: 'Format tanggal lahir tidak valid.' })
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  nik?: string;

  @IsString()
  @IsOptional()
  nisn?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon/HP wajib diisi.' })
  phone!: string;

  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email wajib diisi.' })
  email!: string;

  @IsString()
  @IsOptional()
  institution?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  identityCardUrl?: string;
}

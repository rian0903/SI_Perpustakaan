import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi.' })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis kelamin wajib diisi.' })
  gender!: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDateString({}, { message: 'Format tanggal lahir tidak valid.' })
  @IsOptional()
  birthDate?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  nik?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  nisn?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon/HP wajib diisi.' })
  phone!: string;

  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email wajib diisi.' })
  email!: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  institution?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  occupation?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsOptional()
  identityCardUrl?: string;
}

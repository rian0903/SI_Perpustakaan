import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Auto-seed initial Super Admin on module startup if database users table is empty
  async onModuleInit() {
    try {
      const userCount = await this.prisma.user.count();
      if (userCount === 0) {
        const defaultEmail = 'superadmin@perpustakaan.go.id';
        const defaultPassword = 'superadmin123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await this.prisma.user.create({
          data: {
            email: defaultEmail,
            password: hashedPassword,
            name: 'Super Admin Kota Buku',
            role: Role.SUPER_ADMIN,
          },
        });
        console.log('----------------------------------------------------');
        console.log(`[SEED] Seeded initial Super Admin account:`);
        console.log(`Email: ${defaultEmail}`);
        console.log(`Password: ${defaultPassword}`);
        console.log('----------------------------------------------------');
      }
    } catch (err) {
      const error = err as Error;
      console.error(
        '[SEED] Failed to seed default Super Admin account:',
        error.message,
      );
    }
  }

  async login(loginDto: Record<string, unknown>) {
    const { email, password } = loginDto as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      throw new UnauthorizedException('Email dan password harus diisi.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Kombinasi email atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kombinasi email atau password salah.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan.');
    }
    return user;
  }
}

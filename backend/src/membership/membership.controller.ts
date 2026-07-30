import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { RejectMembershipDto } from './dto/reject-membership.dto';
import { MembershipQueryDto } from './dto/membership-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  @Post('membership/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname
            .replace(ext, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');
          callback(null, `member-${name}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 8 * 1024 * 1024, // 8MB Limit
      },
      fileFilter: (req: any, file: any, callback: any) => {
        const allowedTypes = /jpeg|jpg|png|webp|pdf/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
          return callback(null, true);
        }
        callback(
          new BadRequestException('Format file harus berupa gambar (JPG, PNG, WEBP) atau PDF dengan ukuran maksimal 8MB.'),
          false,
        );
      },
    }),
  )
  async uploadMembershipDocument(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan atau format file tidak sesuai.');
    }
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  @Post('membership')
  async createMembership(@Body() dto: CreateMembershipDto) {
    return this.membershipService.register(dto);
  }

  @Get('membership/status/:registrationNumber')
  async getMembershipStatus(@Param('registrationNumber') registrationNumber: string) {
    return this.membershipService.getStatus(registrationNumber);
  }

  // ==========================================
  // ADMIN ENDPOINTS (PROTECTED)
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('admin/membership/stats')
  async getMembershipStats() {
    return this.membershipService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('admin/membership')
  async listMemberships(@Query() query: MembershipQueryDto) {
    return this.membershipService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('admin/membership/:id')
  async getMembershipDetail(@Param('id') id: string) {
    return this.membershipService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/membership/:id/approve')
  async approveMembership(@Param('id') id: string) {
    return this.membershipService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/membership/:id/reject')
  async rejectMembership(@Param('id') id: string, @Body() dto: RejectMembershipDto) {
    return this.membershipService.reject(id, dto.rejectionReason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/membership/:id/ready-for-pickup')
  async readyForPickupMembership(@Param('id') id: string) {
    return this.membershipService.markReadyForPickup(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('admin/membership/:id/activate')
  async activateMembership(@Param('id') id: string) {
    return this.membershipService.activate(id);
  }
}

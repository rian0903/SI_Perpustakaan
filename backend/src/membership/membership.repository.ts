import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Membership, MembershipStatus, Prisma } from '@prisma/client';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMembershipDto & { registrationNumber: string }): Promise<Membership> {
    return this.prisma.membership.create({
      data: {
        registrationNumber: data.registrationNumber,
        fullName: data.fullName,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        nik: data.nik || null,
        nisn: data.nisn || null,
        address: data.address || null,
        phone: data.phone,
        email: data.email,
        institution: data.institution || null,
        occupation: data.occupation || null,
        photoUrl: data.photoUrl || null,
        identityCardUrl: data.identityCardUrl || null,
        status: MembershipStatus.PENDING,
      },
    });
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: { registrationNumber },
    });
  }

  async findById(id: string): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: { id },
    });
  }

  async findByNik(nik: string): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: { nik },
    });
  }

  async countByYear(year: number, prefix: 'REG' | 'LIB'): Promise<number> {
    if (prefix === 'REG') {
      return this.prisma.membership.count({
        where: {
          registrationNumber: {
            startsWith: `REG-${year}-`,
          },
        },
      });
    } else {
      return this.prisma.membership.count({
        where: {
          membershipNumber: {
            startsWith: `LIB-${year}-`,
          },
        },
      });
    }
  }

  async findAll(params: {
    status?: MembershipStatus;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: Membership[]; total: number; page: number; totalPages: number }> {
    const { status, search, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.MembershipWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { registrationNumber: { contains: search } },
        { membershipNumber: { contains: search } },
        { email: { contains: search } },
        { nik: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.membership.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.membership.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateStatus(
    id: string,
    data: {
      status: MembershipStatus;
      membershipNumber?: string;
      rejectionReason?: string;
      approvedAt?: Date;
      pickupReadyAt?: Date;
      collectedAt?: Date;
    },
  ): Promise<Membership> {
    return this.prisma.membership.update({
      where: { id },
      data,
    });
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    readyForPickup: number;
    active: number;
    rejected: number;
  }> {
    const [total, pending, approved, readyForPickup, active, rejected] = await Promise.all([
      this.prisma.membership.count(),
      this.prisma.membership.count({ where: { status: MembershipStatus.PENDING } }),
      this.prisma.membership.count({ where: { status: MembershipStatus.APPROVED } }),
      this.prisma.membership.count({ where: { status: MembershipStatus.READY_FOR_PICKUP } }),
      this.prisma.membership.count({ where: { status: MembershipStatus.ACTIVE } }),
      this.prisma.membership.count({ where: { status: MembershipStatus.REJECTED } }),
    ]);

    return {
      total,
      pending,
      approved,
      readyForPickup,
      active,
      rejected,
    };
  }
}

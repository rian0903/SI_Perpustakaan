import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // ==========================================
  // USERS MANAGEMENT (SUPER_ADMIN ONLY)
  // ==========================================
  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(dto: Record<string, unknown>) {
    const { email, password, name, role } = dto as {
      email?: string;
      password?: string;
      name?: string;
      role?: string;
    };
    if (!email || !password || !name) {
      throw new BadRequestException('Email, password, dan nama harus diisi.');
    }
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email sudah digunakan.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role === 'SUPER_ADMIN' ? Role.SUPER_ADMIN : Role.ADMIN,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: string, requesterId: string) {
    if (id === requesterId) {
      throw new BadRequestException(
        'Anda tidak dapat menghapus akun Anda sendiri.',
      );
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan.');
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // NEWS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listNews(all = true) {
    return this.prisma.news.findMany({
      where: all ? {} : { published: true },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNewsById(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!news) throw new NotFoundException('Berita tidak ditemukan.');
    return news;
  }

  async createNews(dto: Record<string, unknown>, authorId: string) {
    const { title, content, thumbnail, published, categoryName } = dto as {
      title?: string;
      content?: string;
      thumbnail?: string;
      published?: boolean;
      categoryName?: string;
    };
    if (!title || !content) {
      throw new BadRequestException('Judul dan konten harus diisi.');
    }
    let category = await this.prisma.category.findUnique({
      where: { name: categoryName || 'Berita' },
    });
    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: categoryName || 'Berita',
          slug: this.generateSlug(categoryName || 'Berita'),
        },
      });
    }

    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let index = 1;
    while (await this.prisma.news.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${index++}`;
    }

    return this.prisma.news.create({
      data: {
        title,
        slug,
        content,
        thumbnail,
        published: published ?? false,
        authorId,
        categoryId: category.id,
      },
      include: { category: true },
    });
  }

  async updateNews(id: string, dto: Record<string, unknown>) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('Berita tidak ditemukan.');

    const { title, content, thumbnail, published, categoryName } = dto as {
      title?: string;
      content?: string;
      thumbnail?: string;
      published?: boolean;
      categoryName?: string;
    };
    const updateData: {
      title?: string;
      slug?: string;
      content?: string;
      thumbnail?: string;
      published?: boolean;
      categoryId?: number;
    } = {};

    if (title) {
      updateData.title = title;
      const baseSlug = this.generateSlug(title);
      let slug = baseSlug;
      let index = 1;
      while (
        await this.prisma.news.findFirst({ where: { slug, NOT: { id } } })
      ) {
        slug = `${baseSlug}-${index++}`;
      }
      updateData.slug = slug;
    }
    if (content !== undefined) updateData.content = content;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (published !== undefined) updateData.published = published;

    if (categoryName) {
      let category = await this.prisma.category.findUnique({
        where: { name: categoryName },
      });
      if (!category) {
        category = await this.prisma.category.create({
          data: { name: categoryName, slug: this.generateSlug(categoryName) },
        });
      }
      updateData.categoryId = category.id;
    }

    return this.prisma.news.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  }

  async deleteNews(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('Berita tidak ditemukan.');
    await this.prisma.news.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // EVENTS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listEvents() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async createEvent(dto: Record<string, unknown>) {
    const { title, description, date, location, speaker, thumbnail, capacity } =
      dto as {
        title?: string;
        description?: string;
        date?: string;
        location?: string;
        speaker?: string;
        thumbnail?: string;
        capacity?: string | number;
      };
    if (!title || !description || !date || !location) {
      throw new BadRequestException('Form data event tidak lengkap.');
    }
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let index = 1;
    while (await this.prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${index++}`;
    }

    const capacityVal =
      typeof capacity === 'string' ? parseInt(capacity, 10) : capacity;

    return this.prisma.event.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        location,
        speaker,
        thumbnail,
        capacity: capacityVal ?? null,
      },
    });
  }

  async updateEvent(id: string, dto: Record<string, unknown>) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan.');

    const { title, description, date, location, speaker, thumbnail, capacity } =
      dto as {
        title?: string;
        description?: string;
        date?: string;
        location?: string;
        speaker?: string;
        thumbnail?: string;
        capacity?: string | number;
      };
    const updateData: {
      title?: string;
      slug?: string;
      description?: string;
      date?: Date;
      location?: string;
      speaker?: string;
      thumbnail?: string;
      capacity?: number | null;
    } = {};

    if (title) {
      updateData.title = title;
      const baseSlug = this.generateSlug(title);
      let slug = baseSlug;
      let index = 1;
      while (
        await this.prisma.event.findFirst({ where: { slug, NOT: { id } } })
      ) {
        slug = `${baseSlug}-${index++}`;
      }
      updateData.slug = slug;
    }
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (location !== undefined) updateData.location = location;
    if (speaker !== undefined) updateData.speaker = speaker;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (capacity !== undefined) {
      updateData.capacity =
        typeof capacity === 'string' ? parseInt(capacity, 10) : capacity;
    }

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteEvent(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan.');
    await this.prisma.event.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // GALLERY CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listGalleries() {
    return this.prisma.gallery.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGallery(dto: Record<string, unknown>) {
    const { title, description, thumbnail, images } = dto as {
      title?: string;
      description?: string;
      thumbnail?: string;
      images?: Array<{ imageUrl: string; caption?: string }>;
    };
    if (!title) {
      throw new BadRequestException('Judul album harus diisi.');
    }
    const galleryImages = images
      ? images.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption,
        }))
      : [];

    return this.prisma.gallery.create({
      data: {
        title,
        description,
        thumbnail,
        images: { create: galleryImages },
      },
      include: { images: true },
    });
  }

  async deleteGallery(id: string) {
    const gallery = await this.prisma.gallery.findUnique({ where: { id } });
    if (!gallery) throw new NotFoundException('Album galeri tidak ditemukan.');
    await this.prisma.gallery.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // BANNERS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listBanners() {
    return this.prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createBanner(dto: Record<string, unknown>) {
    const { title, subtitle, imageUrl, linkUrl, order, active } = dto as {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      linkUrl?: string;
      order?: string | number;
      active?: boolean;
    };
    if (!title || !imageUrl) {
      throw new BadRequestException('Judul banner dan URL Gambar harus diisi.');
    }
    const orderVal = typeof order === 'string' ? parseInt(order, 10) : order;
    return this.prisma.banner.create({
      data: {
        title,
        subtitle,
        imageUrl,
        linkUrl,
        order: orderVal ?? 0,
        active: active ?? true,
      },
    });
  }

  async updateBanner(id: number, dto: Record<string, unknown>) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner tidak ditemukan.');

    const { title, subtitle, imageUrl, linkUrl, order, active } = dto as {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      linkUrl?: string;
      order?: string | number;
      active?: boolean;
    };
    const updateData: {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      linkUrl?: string;
      order?: number;
      active?: boolean;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (order !== undefined) {
      updateData.order =
        typeof order === 'string' ? parseInt(order, 10) : order;
    }
    if (active !== undefined) updateData.active = active;

    return this.prisma.banner.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteBanner(id: number) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner tidak ditemukan.');
    await this.prisma.banner.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // FAQ CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listFaq() {
    return this.prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createFaq(dto: Record<string, unknown>) {
    const { question, answer, order } = dto as {
      question?: string;
      answer?: string;
      order?: string | number;
    };
    if (!question || !answer) {
      throw new BadRequestException('Pertanyaan dan jawaban harus diisi.');
    }
    const orderVal = typeof order === 'string' ? parseInt(order, 10) : order;
    return this.prisma.faq.create({
      data: {
        question,
        answer,
        order: orderVal ?? 0,
      },
    });
  }

  async updateFaq(id: number, dto: Record<string, unknown>) {
    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ tidak ditemukan.');

    const { question, answer, order } = dto as {
      question?: string;
      answer?: string;
      order?: string | number;
    };
    const updateData: {
      question?: string;
      answer?: string;
      order?: number;
    } = {};

    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order !== undefined) {
      updateData.order =
        typeof order === 'string' ? parseInt(order, 10) : order;
    }

    return this.prisma.faq.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteFaq(id: number) {
    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ tidak ditemukan.');
    await this.prisma.faq.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // CONTACT SUBMISSIONS (VISITOR SUBMITS, ADMIN READS)
  // ==========================================
  async listContacts() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createContact(dto: Record<string, unknown>) {
    const { name, email, subject, message } = dto as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    if (!name || !email || !message) {
      throw new BadRequestException(
        'Nama, email, dan pesan aduan harus diisi.',
      );
    }
    return this.prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || 'Kontak Umum',
        message,
      },
    });
  }

  async markContactRead(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Aduan/kontak tidak ditemukan.');
    return this.prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // ==========================================
  // CONFIG SETTINGS (SUPER_ADMIN ONLY EDIT)
  // ==========================================
  async listSettings() {
    return this.prisma.setting.findMany();
  }

  async updateSetting(key: string, value: string, description?: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  // ==========================================
  // SOCIAL MEDIA (ADMIN / SUPER_ADMIN)
  // ==========================================
  async listSocialMedia() {
    return this.prisma.socialMedia.findMany();
  }

  async updateSocialMedia(dto: Record<string, unknown>) {
    const { platform, url, icon } = dto as {
      platform?: string;
      url?: string;
      icon?: string;
    };
    if (!platform || !url) {
      throw new BadRequestException(
        'Platform dan URL media sosial harus diisi.',
      );
    }
    const existing = await this.prisma.socialMedia.findFirst({
      where: { platform },
    });

    if (existing) {
      return this.prisma.socialMedia.update({
        where: { id: existing.id },
        data: { url, icon },
      });
    } else {
      return this.prisma.socialMedia.create({
        data: { platform, url, icon },
      });
    }
  }
}

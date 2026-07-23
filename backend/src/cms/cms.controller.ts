import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cms')
export class CmsController {
  constructor(private cmsService: CmsService) {}

  // ==========================================
  // FILE UPLOADS (ADMIN / SUPER_ADMIN) - MAX 12MB
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('upload')
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
          callback(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 12 * 1024 * 1024, // 12MB Limit
      },
      fileFilter: (req: any, file: any, callback: any) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx|xls|xlsx|txt|zip/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype) || file.mimetype === 'application/octet-stream';
        if (extName || mimeType) {
          return callback(null, true);
        }
        callback(
          new BadRequestException(
            'Tipe file tidak didukung! Format yang diperbolehkan: Gambar (JPG, PNG, WEBP, GIF, SVG) atau Dokumen (PDF, DOC, XLS, TXT, ZIP).',
          ),
          false,
        );
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan atau ukuran melebihi batas 12MB!');
    }
    const fileUrl = `/uploads/${file.filename}`;
    return {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }


  // ==========================================
  // USERS MANAGEMENT (SUPER_ADMIN ONLY)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('users')
  async listUsers() {
    return this.cmsService.listUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('users')
  async createUser(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('users/:id')
  async deleteUser(
    @Param('id') id: string,
    @Request() req: Record<string, any>,
  ) {
    const user = req.user as { id: string };
    return this.cmsService.deleteUser(id, user.id);
  }

  // ==========================================
  // NEWS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('news')
  async listNews(@Query('all') all?: string) {
    return this.cmsService.listNews(all !== 'false');
  }

  @Get('news/:id')
  async getNewsById(@Param('id') id: string) {
    return this.cmsService.getNewsById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('news')
  async createNews(
    @Body() dto: Record<string, unknown>,
    @Request() req: Record<string, any>,
  ) {
    const user = req.user as { id: string };
    return this.cmsService.createNews(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put('news/:id')
  async updateNews(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateNews(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('news/:id')
  async deleteNews(@Param('id') id: string) {
    return this.cmsService.deleteNews(id);
  }

  // ==========================================
  // EVENTS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('events')
  async listEvents() {
    return this.cmsService.listEvents();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('events')
  async createEvent(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createEvent(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put('events/:id')
  async updateEvent(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateEvent(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string) {
    return this.cmsService.deleteEvent(id);
  }

  // ==========================================
  // GALLERY CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('gallery')
  async listGalleries() {
    return this.cmsService.listGalleries();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('gallery')
  async createGallery(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createGallery(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('gallery/:id')
  async deleteGallery(@Param('id') id: string) {
    return this.cmsService.deleteGallery(id);
  }

  // ==========================================
  // BANNERS CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('banners')
  async listBanners() {
    return this.cmsService.listBanners();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('banners')
  async createBanner(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createBanner(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put('banners/:id')
  async updateBanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateBanner(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('banners/:id')
  async deleteBanner(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.deleteBanner(id);
  }

  // ==========================================
  // FAQ CRUD (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('faq')
  async listFaq() {
    return this.cmsService.listFaq();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('faq')
  async createFaq(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createFaq(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put('faq/:id')
  async updateFaq(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateFaq(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('faq/:id')
  async deleteFaq(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.deleteFaq(id);
  }

  // ==========================================
  // CONTACT SUBMISSIONS (VISITOR FORM & ADMIN LIST)
  // ==========================================
  @Post('contacts/public')
  async createContact(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createContact(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('contacts')
  async listContacts() {
    return this.cmsService.listContacts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch('contacts/:id/read')
  async markContactRead(@Param('id') id: string) {
    return this.cmsService.markContactRead(id);
  }

  // ==========================================
  // CONFIG SETTINGS (SUPER_ADMIN ONLY EDIT)
  // ==========================================
  @Get('settings')
  async listSettings() {
    return this.cmsService.listSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('settings')
  async updateSetting(
    @Body() body: { key: string; value: string; description?: string },
  ) {
    return this.cmsService.updateSetting(
      body.key,
      body.value,
      body.description,
    );
  }

  // ==========================================
  // SOCIAL MEDIA (ADMIN / SUPER_ADMIN)
  // ==========================================
  @Get('social-media')
  async listSocialMedia() {
    return this.cmsService.listSocialMedia();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('social-media')
  async updateSocialMedia(@Body() dto: Record<string, unknown>) {
    return this.cmsService.updateSocialMedia(dto);
  }

  // ==========================================
  // NAV MENU ITEMS (SUPER_ADMIN ONLY EDIT, PUBLIC READ)
  // ==========================================
  @Get('nav-menu')
  async listNavMenu() {
    return this.cmsService.listNavMenu();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('nav-menu')
  async createNavMenuItem(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createNavMenuItem(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Put('nav-menu/:id')
  async updateNavMenuItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateNavMenuItem(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('nav-menu/:id')
  async deleteNavMenuItem(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.deleteNavMenuItem(id);
  }

  // ==========================================
  // CONTACT BUTTONS (SUPER_ADMIN ONLY EDIT, PUBLIC READ)
  // ==========================================
  @Get('contact-buttons')
  async listContactButtons() {
    return this.cmsService.listContactButtons();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('contact-buttons')
  async createContactButton(@Body() dto: Record<string, unknown>) {
    return this.cmsService.createContactButton(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Put('contact-buttons/:id')
  async updateContactButton(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.cmsService.updateContactButton(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('contact-buttons/:id')
  async deleteContactButton(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.deleteContactButton(id);
  }
}

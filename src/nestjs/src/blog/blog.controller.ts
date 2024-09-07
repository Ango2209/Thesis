import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { BlogDocument } from './schemas/blog.schema';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBlogDto } from './dto/createBlogDto';
import { UploadService } from 'src/upload/upload.service';

@Controller('blogs')
export class BlogController extends BaseController<BlogDocument> {
  constructor(
    private readonly blogService: BlogService,
    private readonly uploadService: UploadService,
  ) {
    super(blogService);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createDoctor(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createDto: CreateBlogDto,
  ): Promise<BlogDocument> {
    if (file && !this.uploadService.isImageFile(file)) {
      throw new BadRequestException('Only image files are allowed.');
    }

    const filePath = file
      ? await this.uploadService.saveFile(file)
      : 'defaultAvatar.jpg'; //check file

    return this.blogService.create({ ...createDto, imageFuturedUrl: filePath });
  }
}

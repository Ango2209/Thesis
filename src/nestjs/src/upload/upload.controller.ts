import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  async uploadImages(@Body() base64Images: string[]): Promise<string[]> {
    const uploadPromises = base64Images.map((image) =>
      this.uploadService.saveBase64Image(image),
    );
    return Promise.all(uploadPromises);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return await this.uploadService.saveFiles(files);
  }
}

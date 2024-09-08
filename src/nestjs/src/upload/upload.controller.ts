import { Body, Controller, Post } from '@nestjs/common';
import { UploadService } from './upload.service';

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
}

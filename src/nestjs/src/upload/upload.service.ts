import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  async saveFile(file: Express.Multer.File): Promise<string | null> {
    if (!file) {
      return null;
    }
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const uploadPath = join(__dirname, '../../uploads', uniqueFilename);
    await writeFile(uploadPath, file.buffer);
    return uploadPath;
  }

  // Utility function to check if the file is an image
  public isImageFile(file: Express.Multer.File | undefined): boolean {
    if (!file) return false;
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = extname(file.originalname).toLowerCase();
    return validImageExtensions.includes(fileExtension);
  }

  async saveBase64Image(base64Image: string): Promise<string> {
    const matches = base64Image.match(/^data:image\/(.+);base64,(.*)$/);
    if (!matches) {
      throw new Error('Invalid base64 image');
    }

    const ext = matches[1];
    const data = matches[2];
    const filename = `${uuidv4()}.${ext}`;
    const filePath = join(__dirname, '../../uploads', filename);

    await writeFile(filePath, Buffer.from(data, 'base64'));
    return filePath;
  }
}

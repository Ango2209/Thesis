import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  private s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new HttpException(
        'File size exceeds the limit of 5MB',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const uniqueFilename = `${uuidv4()}-${file.originalname}${extname(file.originalname)}`;

    try {
      const params = {
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: uniqueFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      throw new HttpException(
        `Failed to upload file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadedFileUrls: string[] = [];
    if (!files || files.length === 0) {
      return uploadedFileUrls;
    }

    for (const file of files) {
      const fileUrl = await this.saveFile(file);
      uploadedFileUrls.push(fileUrl);
    }

    return uploadedFileUrls;
  }

  async saveBase64Image(base64Image: string): Promise<string> {
    const matches = base64Image.match(/^data:image\/(.+);base64,(.*)$/);
    if (!matches) {
      throw new HttpException('Invalid base64 image', HttpStatus.BAD_REQUEST);
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    if (buffer.length > this.MAX_FILE_SIZE) {
      throw new HttpException(
        'Image size exceeds the limit of 5MB',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const filename = `${uuidv4()}.${ext}`;

    try {
      const params = {
        Bucket: this.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: `image/${ext}`,
      };

      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new HttpException(
        `Failed to upload image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Utility function to check if the file is an image
  public isImageFile(file: Express.Multer.File | undefined): boolean {
    if (!file) return false;
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = extname(file.originalname).toLowerCase();
    return validImageExtensions.includes(fileExtension);
  }
}

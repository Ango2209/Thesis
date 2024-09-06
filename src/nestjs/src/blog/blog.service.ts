import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class BlogService extends BaseServices<BlogDocument> {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    private readonly uploadService: UploadService,
  ) {
    super(blogModel);
  }

  replaceBase64WithUrl(
    content: string,
    base64Images: string[],
    imageUrls: string[],
  ): string {
    let updatedContent = content;
    base64Images.forEach((base64Image, index) => {
      updatedContent = updatedContent.replace(base64Image, imageUrls[index]);
    });
    return updatedContent;
  }

  async create(createDto: any): Promise<BlogDocument> {
    const categories = JSON.parse(createDto.categories);
    createDto.categories = categories;
    const createdEntity = new this.blogModel({
      ...createDto,
    });
    return createdEntity.save();
  }
}

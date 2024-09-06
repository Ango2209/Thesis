import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    UploadModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}

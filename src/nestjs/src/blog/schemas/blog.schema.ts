import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

class Category {
  @Prop()
  name: string;

  @Prop()
  slug: string;
}

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;
  @Prop()
  slug: string;
  @Prop()
  imageFuturedUrl: string;
  @Prop()
  description: string;
  @Prop([Category])
  categories: Category[];
  @Prop()
  content: string;
  @Prop({ type: Types.ObjectId, refPath: 'authorModel' })
  authorObjid: Types.ObjectId;
  @Prop({ enum: ['Doctor', 'Admin'], required: true })
  authorModel: string;
  @Prop()
  isVisible: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

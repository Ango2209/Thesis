import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Anhngo2208:Anhngole.123@cluster0.onhfeyv.mongodb.net/test')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

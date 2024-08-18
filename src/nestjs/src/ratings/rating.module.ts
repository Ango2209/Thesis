import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Rating, RatingSchema } from "./schemas/rating.schemas";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }])
    ],
    controllers: [RatingController],
    providers: [RatingService],
})

export class RatingModule { }
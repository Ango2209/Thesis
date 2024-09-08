import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServices } from "src/common/base.services";
import { Rating, RatingDocument } from "./schemas/rating.schemas";

@Injectable()
export class RatingService extends BaseServices<RatingDocument> {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<RatingDocument>) {
        super(ratingModel)
    }
}

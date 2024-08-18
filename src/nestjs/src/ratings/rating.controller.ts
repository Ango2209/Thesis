import { Controller, Injectable } from "@nestjs/common";
import { BaseServices } from "src/common/base.services";
import { BaseController } from "src/common/base.controller";
import { RatingDocument } from "./schemas/rating.schemas";
import { RatingService } from "./rating.services";


@Controller('ratings')
export class RatingController extends BaseController<RatingDocument> {
    constructor(private readonly ratingService: RatingService) {
        super(ratingService);
    }
}
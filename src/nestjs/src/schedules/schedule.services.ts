import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Schedule, ScheduleDocument } from "./schemas/schedule.schemas";
import { BaseServices } from "src/common/base.services";

@Injectable()
export class ScheduleService extends BaseServices<ScheduleDocument> {
    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>) {
        super(scheduleModel)
    }
}

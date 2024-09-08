import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleController } from "./shedule.controller";
import { ScheduleService } from "./schedule.services";
import { Schedule, ScheduleSchema } from "./schemas/schedule.schemas";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }])
    ],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})

export class ScheduleModule { }
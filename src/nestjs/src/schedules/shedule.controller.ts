import { Controller, Injectable } from "@nestjs/common";
import { ScheduleService } from "./schedule.services";
import { ScheduleDocument } from "./schemas/schedule.schemas";

import { BaseController } from "src/common/base.controller";


@Controller('schedules')
export class ScheduleController extends BaseController<ScheduleDocument> {
    constructor(private readonly scheduleService: ScheduleService) {
        super(scheduleService);
    }
}
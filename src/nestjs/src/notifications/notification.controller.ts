import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { BaseController } from "src/common/base.controller";
import { NotificationDocument } from "./schemas/notification.schema";
import { NotificationService } from "./notification.services";


@Controller('notifications')
export class NotificationController extends BaseController<NotificationDocument> {
    constructor(private readonly notificationService: NotificationService) {
        super(notificationService);
    }

    @Get('/doctor/:id')
    async getNotificationsByDoctorId(@Param('id') id: string): Promise<any> {
        return this.notificationService.getNotificationsByDoctorId(id);
    }
}
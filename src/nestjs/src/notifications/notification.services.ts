import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServices } from "src/common/base.services";
import { Notification, NotificationDocument } from "./schemas/notification.schema";


@Injectable()
export class NotificationService extends BaseServices<NotificationDocument> {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {
        super(notificationModel)
    }
    async getNotificationsByDoctorId(doctorId: string): Promise<any> {
        try {
   
            return await this.notificationModel.find({ doctorId: doctorId });
        } catch (error) {
            throw new Error(error);
        }
    }
}

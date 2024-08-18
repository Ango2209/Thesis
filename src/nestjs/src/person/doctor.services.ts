import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'

import { BaseServices } from "src/common/base.services";
import { Doctor, DoctorDocument } from "./schemas/doctor.schema";

@Injectable()
export class DoctorService extends BaseServices<DoctorDocument> {
    constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {
        super(doctorModel)
    }
}
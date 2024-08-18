import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import { Patient, PatientDocument } from "./schemas/patient.schemas";
import { BaseServices } from "src/common/base.services";

@Injectable()
export class PatientService extends BaseServices<PatientDocument> {
    constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {
        super(patientModel)
    }
}
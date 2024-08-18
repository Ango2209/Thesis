import { Controller } from "@nestjs/common";
import { PatientService } from "./patient.services";
import { PatientDocument } from "./schemas/patient.schemas";
import { BaseController } from "src/common/base.controller";

@Controller('patients')
export class PatientController extends BaseController<PatientDocument> {
    constructor(private readonly patientService: PatientService) {
        super(patientService)
    }
}
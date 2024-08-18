import { Controller, Injectable } from "@nestjs/common";
import { BaseServices } from "src/common/base.services";
import { BaseController } from "src/common/base.controller";
import { MedicineService } from "./medicine.services";
import { MedicineDocument } from "./schemas/medicine.schemas";



@Controller('medicines')
export class MedicineController extends BaseController<MedicineDocument> {
    constructor(private readonly medicineService: MedicineService) {
        super(medicineService);
    }
}
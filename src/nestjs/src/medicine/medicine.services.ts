import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServices } from "src/common/base.services";
import { Medicine, MedicineDocument } from "./schemas/medicine.schemas";


@Injectable()
export class MedicineService extends BaseServices<MedicineDocument> {
    constructor(@InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>) {
        super(medicineModel)
    }
}

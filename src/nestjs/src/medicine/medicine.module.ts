import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Medicine, MedicineSchema } from "./schemas/medicine.schemas";
import { MedicineController } from "./medicine.controller";
import { MedicineService } from "./medicine.services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Medicine.name, schema: MedicineSchema }])
    ],
    controllers: [MedicineController],
    providers: [MedicineService],
})

export class MedicineModule { }
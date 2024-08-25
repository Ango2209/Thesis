import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { Batch, BatchDocument } from './schemas/batch.schema';
import { AddNewBatchDto } from './dto/addNewBatchDto';

@Injectable()
export class MedicineService extends BaseServices<MedicineDocument> {
  constructor(
    @InjectModel(Medicine.name)
    private readonly medicineModel: Model<MedicineDocument>,
    @InjectModel(Batch.name) private readonly batchModel: Model<BatchDocument>,
  ) {
    super(medicineModel);
  }

  async create(createDto: any): Promise<MedicineDocument> {
    const createdEntity = new this.medicineModel({
      ...createDto,
      basePrice: 0,
    });
    return createdEntity.save();
  }

  async calculateAveragePriceForMedicine(medicineId: string): Promise<number> {
    const now = new Date();

    const batches = await this.batchModel.find({
      medicineId: new Types.ObjectId(medicineId),
      expiryDate: { $gt: now },
    });

    if (batches.length === 0) {
      throw new Error('No batch of expired drugs');
    }

    let totalQuantity = 0;
    let totalCost = 0;

    for (const batch of batches) {
      totalQuantity += batch.quantity;
      totalCost += batch.quantity * batch.purchasePrice;
    }

    const averagePrice = totalCost / totalQuantity;

    return averagePrice;
  }

  private validateExpiryDate(expiryDate: Date): void {
    const now = new Date();
    const limitDate = new Date();
    limitDate.setMonth(now.getMonth() + 6);

    if (expiryDate <= limitDate) {
      throw new Error(
        'The expiration date of the batch of drugs is too short to be stored.',
      );
    }
  }

  async addNewBatch(
    medicineId: string,
    addNewBatchDto: AddNewBatchDto,
  ): Promise<any> {
    const profitMargin = 1.5;
    this.validateExpiryDate(addNewBatchDto.expiryDate);

    const newBatch = new this.batchModel({
      medicineId: new Types.ObjectId(medicineId),
      ...addNewBatchDto,
    });
    await newBatch.save();

    //calculate base price
    const newAveragePrice = await this.calculateAveragePriceForMedicine(
      newBatch.medicineId.toString(),
    );

    const basePrice = newAveragePrice * profitMargin;
    const newBasePrice = parseFloat(basePrice.toFixed(2));

    // update base price
    await this.medicineModel.findByIdAndUpdate(newBatch.medicineId, {
      basePrice: newBasePrice,
    });

    return { ...newBatch, medicineId };
  }

  async dispenseMedicine(
    medicineId: string,
    prescribedQuantity: number,
  ): Promise<void> {
    const now = new Date();
    const limitDate = new Date();
    limitDate.setMonth(now.getMonth() + 6);
    let remainingQuantity = prescribedQuantity;

    const batches = await this.batchModel
      .find({
        medicineId: new Types.ObjectId(medicineId),
        expiryDate: { $gt: limitDate },
      })
      .sort({ expiryDate: 1 });

    for (const batch of batches) {
      if (remainingQuantity <= 0) break;

      const quantityToUse = Math.min(batch.quantity, remainingQuantity);
      batch.quantity -= quantityToUse;
      await batch.save();

      remainingQuantity -= quantityToUse;
    }

    if (remainingQuantity > 0) {
      throw new Error('Not enough drugs to prescribe');
    }
  }
}

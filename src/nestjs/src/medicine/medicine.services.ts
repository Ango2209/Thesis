import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Document, Model, Types } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { Batch, BatchDocument } from './schemas/batch.schema';
import { AddNewBatchDto } from './dto/addNewBatchDto';
import { CreatePrescriptionItemDto } from './dto/createPrescriptionDto';

@Injectable()
export class MedicineService extends BaseServices<MedicineDocument> {
  constructor(
    @InjectModel(Medicine.name)
    private readonly medicineModel: Model<MedicineDocument>,
    @InjectModel(Batch.name) private readonly batchModel: Model<BatchDocument>,
    @InjectConnection() private readonly connection: Connection,
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
      quantity: addNewBatchDto.quantityEntered,
    });
    const batchSaved = await newBatch.save();

    //calculate base price
    const newAveragePrice = await this.calculateAveragePriceForMedicine(
      newBatch.medicineId.toString(),
    );

    const basePrice = newAveragePrice * profitMargin;
    const newBasePrice = parseFloat(basePrice.toFixed(2));

    // update base price
    await this.medicineModel.findByIdAndUpdate(newBatch.medicineId, {
      basePrice: newBasePrice,
      avgPurchasePrice: newAveragePrice,
    });

    return batchSaved;
  }

  async createPrescription(
    createPrescriptionsDto: CreatePrescriptionItemDto[],
  ): Promise<CreatePrescriptionItemDto[]> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const processedItems: CreatePrescriptionItemDto[] = [];

    try {
      for (const item of createPrescriptionsDto) {
        //Check valid medicine
        const medicine = await this.medicineModel
          .findById(item.medicineId)
          .session(session)
          .exec();
        if (!medicine) {
          throw new NotFoundException(
            `Medicine with ID ${item.medicineId} not found`,
          );
        }

        item.itemName = medicine.name;
        item.itemPrice = medicine.basePrice;
        item.amount = item.quantity * item.itemPrice;
        try {
          await this.dispenseMedicine(item.medicineId, item.quantity, session);
          processedItems.push(item);
        } catch (error) {
          // Handle case when not enough stock is available
          if (error.message.includes('Not enough drugs to prescribe')) {
            throw new BadRequestException(
              `Not enough stock for medicine ID ${item.medicineId}`,
            );
          } else {
            throw error; // Re-throw if it's not a known error
          }
        }
      }
      await session.commitTransaction();
      return processedItems;
    } catch (error) {
      //roll back
      await session.abortTransaction();
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          'An unexpected error occurred while processing prescriptions',
        );
      }
    } finally {
      session.endSession();
    }
  }

  private async dispenseMedicine(
    medicineId: string,
    prescribedQuantity: number,
    session: any,
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
      .sort({ expiryDate: 1 })
      .session(session);

    for (const batch of batches) {
      if (remainingQuantity <= 0) break;

      const quantityToUse = Math.min(batch.quantity, remainingQuantity);
      batch.quantity -= quantityToUse;
      await batch.save({ session });

      remainingQuantity -= quantityToUse;
    }

    if (remainingQuantity > 0) {
      throw new Error('Not enough drugs to prescribe');
    }
  }

  async getMedicinesWithAvailableQuantity(
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const now = new Date();
    const limitDate = new Date();
    limitDate.setMonth(now.getMonth() + 6);

    //get medicines with available quantity
    const medicines = await this.medicineModel
      .aggregate([
        {
          $lookup: {
            from: 'batches', // collection name
            localField: '_id', // medicine id
            foreignField: 'medicineId', // medicine id from batches collection
            as: 'batches', // array name
          },
        },
        {
          $addFields: {
            // add fields to result
            availableQuantity: {
              // field name
              $sum: {
                $map: {
                  //loop
                  input: '$batches', // array name
                  as: 'batch', // item name
                  in: {
                    $cond: {
                      if: { $gt: ['$$batch.expiryDate', limitDate] }, // expiration date is at least 6 months
                      then: '$$batch.quantity', // plus quantity
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            basePrice: 1,
            measure: 1,
            description: 1,
            availableQuantity: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();

    const totalMedicines = await this.medicineModel.countDocuments();

    return {
      totalMedicines,
      totalPages: Math.ceil(totalMedicines / limit),
      currentPage: page,
      medicines,
    };
  }

  async getBatchesByMedicineId(medicineId: string): Promise<any> {
    // Validate medicineId
    if (!Types.ObjectId.isValid(medicineId)) {
      throw new BadRequestException('Invalid medicine ID');
    }

    // Check if medicine exists
    const medicineExists = await this.medicineModel.exists({ _id: medicineId });
    if (!medicineExists) {
      throw new NotFoundException(`Medicine with ID ${medicineId} not found`);
    }

    // Fetch all batches for the given medicineId
    const batches = await this.batchModel.find({
      medicineId: new Types.ObjectId(medicineId),
    });

    if (batches.length === 0) {
      return batches;
    }

    // Process each batch to determine if it can be prescribed
    const currentDate = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(currentDate.getMonth() + 6);

    const processedBatches = batches.map((batch) => {
      const canBePrescribed =
        batch.expiryDate > sixMonthsLater && batch.quantity > 0;
      return {
        ...batch.toObject(),
        canBePrescribed,
      };
    });

    return processedBatches;
  }
}

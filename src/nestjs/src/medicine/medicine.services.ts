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
      totalQuantity += batch.quantityEntered;
      totalCost += batch.quantityEntered * batch.purchasePrice;
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

    const result = await this.batchModel.updateMany(
      {
        batchNumber: addNewBatchDto.batchNumber,
        medicineId: new Types.ObjectId(medicineId),
      },
      { $inc: { quantity: addNewBatchDto.quantityEntered } },
    );

    if (result.modifiedCount === 0) {
      const newBatch = new this.batchModel({
        medicineId: new Types.ObjectId(medicineId),
        ...addNewBatchDto,
        quantity: addNewBatchDto.quantityEntered,
      });
      await newBatch.save();
    }

    //calculate base price
    const newAveragePrice =
      await this.calculateAveragePriceForMedicine(medicineId);

    const basePrice = newAveragePrice * profitMargin;
    const newBasePrice = parseFloat(basePrice.toFixed(2));

    // update base price
    await this.medicineModel.findByIdAndUpdate(new Types.ObjectId(medicineId), {
      basePrice: newBasePrice,
      avgPurchasePrice: newAveragePrice,
    });

    return true;
  }

  async prescribeMedicine(
    createPrescriptionsDto: CreatePrescriptionItemDto[],
  ): Promise<CreatePrescriptionItemDto[]> {
    const processedItems: CreatePrescriptionItemDto[] = [];
    try {
      for (const item of createPrescriptionsDto) {
        //Check valid medicine
        const medicine = await this.medicineModel
          .findById(item.medicineId)
          .exec();
        if (!medicine) {
          throw new NotFoundException(
            `Medicine with ID ${item.medicineId} not found`,
          );
        }

        item.itemName = medicine.name;
        processedItems.push(item);
      }
      return processedItems;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadRequestException(
          'An unexpected error occurred while processing prescriptions',
        );
      }
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

  async findMedicinesByName(name: string): Promise<any[]> {
    const medicines = await this.medicineModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();
    const medicinesWithQuantities = await Promise.all(
      medicines.map(async (medicine) => {
        const availableQuantity = await this.getAvailableQuantity(medicine._id);
        return {
          ...medicine.toObject(),
          availableQuantity,
        };
      }),
    );
    return medicinesWithQuantities;
  }

  // Hàm tính thời điểm 6 tháng sau từ hiện tại
  private sixMonthsFromNow(): Date {
    const now = new Date();
    now.setMonth(now.getMonth() + 6);
    return now;
  }

  private async getAvailableQuantity(medicineId): Promise<number> {
    const aggregationResult = await this.batchModel.aggregate([
      {
        $match: {
          medicineId: new Types.ObjectId(medicineId),
          expiryDate: { $gte: this.sixMonthsFromNow() }, // Lọc theo hạn dùng
          quantity: { $gt: 0 }, // Chỉ lấy lô còn hàng
        },
      },
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: '$quantity' }, // Tổng số lượng từ các lô
        },
      },
    ]);
    const totalAvailable =
      aggregationResult.length > 0 ? aggregationResult[0].totalAvailable : 0;
    return totalAvailable;
  }

  // Hàm kiểm tra số lượng thuốc khả dụng
  async lockMedicinces(
    medicinesToCheck: { medicineId: string; quantityToUse: number }[],
  ): Promise<{
    available: any[];
    unavailable: any[];
  }> {
    const result = {
      available: [],
      unavailable: [],
    };

    for (const { medicineId, quantityToUse } of medicinesToCheck) {
      const medicine = await this.medicineModel.findById(medicineId);

      const totalAvailable = await this.getAvailableQuantity(medicineId);

      if (totalAvailable >= quantityToUse) {
        // Lấy danh sách lô thuốc theo thứ tự hạn gần nhất trước
        const batches = await this.batchModel
          .find({
            medicineId: new Types.ObjectId(medicineId),
            expiryDate: { $gte: this.sixMonthsFromNow() },
            quantity: { $gt: 0 },
          })
          .sort({ expiryDate: 1 });

        let remainingQuantity = quantityToUse;

        for (const batch of batches) {
          const availableQuantity = batch.quantity;

          const quantityToReserve = Math.min(
            availableQuantity,
            remainingQuantity,
          );
          batch.reservedQuantity += quantityToReserve; // Lock số lượng
          batch.quantity -= quantityToReserve; // Giảm số lượng khả dụng
          remainingQuantity -= quantityToReserve;

          // Cập nhật lô thuốc trong cơ sở dữ liệu
          await batch.save();
          if (remainingQuantity === 0) break; // Đủ số lượng, thoát vòng lặp
        }
        result.available.push({ ...medicine.toObject(), quantityToUse });
      } else {
        result.unavailable.push(medicine.toObject());
      }
      return result;
    }
  }

  async reduceMedicinces(
    medicinesToCheck: { medicineId: string; quantityToUse: number }[],
  ): Promise<void> {
    for (const { medicineId, quantityToUse } of medicinesToCheck) {
      // Lấy danh sách lô thuốc theo thứ tự hạn gần nhất trước
      const batches = await this.batchModel
        .find({
          medicineId: new Types.ObjectId(medicineId),
          expiryDate: { $gte: this.sixMonthsFromNow() },
          quantity: { $gt: 0 },
        })
        .sort({ expiryDate: 1 });

      let remainingQuantity = quantityToUse;

      for (const batch of batches) {
        const availableQuantity = batch.quantity;

        const quantityToReserve = Math.min(
          availableQuantity,
          remainingQuantity,
        );
        batch.quantity -= quantityToReserve; // Giảm số lượng khả dụng
        remainingQuantity -= quantityToReserve;

        // Cập nhật lô thuốc trong cơ sở dữ liệu
        await batch.save();
        if (remainingQuantity === 0) break; // Đủ số lượng, thoát vòng lặp
      }
    }
  }

  // Hàm unlock số lượng khi hủy đơn hàng
  async unlockMedicines(
    medicinesToUnlock: { medicineId: string; quantityToUnlock: number }[],
  ): Promise<void> {
    for (const { medicineId, quantityToUnlock } of medicinesToUnlock) {
      let remainingQuantity = quantityToUnlock;

      // Lấy danh sách các lô theo thứ tự hạn gần nhất trước
      const batches = await this.batchModel
        .find({
          medicineId: new Types.ObjectId(medicineId),
          reservedQuantity: { $gt: 0 }, // Chỉ lấy lô đã có reserved
        })
        .sort({ expiryDate: 1 }); // Ưu tiên lô có hạn gần nhất

      for (const batch of batches) {
        const quantityToUnlock = Math.min(
          batch.reservedQuantity,
          remainingQuantity,
        );

        batch.reservedQuantity -= quantityToUnlock;
        remainingQuantity -= quantityToUnlock;

        // Cập nhật lô thuốc trong cơ sở dữ liệu
        await batch.save();

        if (remainingQuantity === 0) break; // Đủ số lượng cần unlock, thoát vòng lặp
      }
    }
  }

  async checkMedicinesAvailability(
    medicinesToCheck: {
      medicineId: string;
      quantityToUse: number;
      dosage: string;
      instraction: string;
    }[],
  ): Promise<{
    available: any[];
    unavailable: any[];
  }> {
    const result = {
      available: [],
      unavailable: [],
    };
    for (const {
      medicineId,
      quantityToUse,
      dosage,
      instraction,
    } of medicinesToCheck) {
      const totalAvailable = await this.getAvailableQuantity(medicineId);
      const medicine = await this.medicineModel.findById(medicineId);
      if (totalAvailable >= quantityToUse) {
        result.available.push({
          ...medicine.toObject(),
          quantityToUse,
          dosage,
          instraction,
        });
      } else {
        result.unavailable.push({
          ...medicine.toObject(),
          quantityToUse,
          availableQuantity: totalAvailable,
        });
      }
    }
    return result;
  }
}

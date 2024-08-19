import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseServices } from 'src/common/base.services';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';

@Injectable()
export class DoctorService extends BaseServices<DoctorDocument> {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {
    super(doctorModel);
  }

  async create(createDto: any): Promise<DoctorDocument> {
    // find max id doctor
    const lastDoctor = await this.doctorModel
      .findOne()
      .sort({ doctor_code: -1 })
      .exec();

    let newDoctorCode = 'DR000001';
    // generate doctorid
    if (lastDoctor && lastDoctor.doctor_id) {
      const currentCodeNumber = parseInt(lastDoctor.doctor_id.slice(2), 10);
      const nextCodeNumber = currentCodeNumber + 1;

      newDoctorCode = `DR${nextCodeNumber.toString().padStart(6, '0')}`;
    }

    const createdEntity = new this.doctorModel({
      ...createDto,
      doctor_id: newDoctorCode,
    });
    return createdEntity.save();
  }
}

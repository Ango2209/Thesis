import { Injectable, NotFoundException } from '@nestjs/common';
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
      .sort({ doctor_id: -1 })
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

  async findByDoctorId(doctor_id: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findOne({ doctor_id }).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctor_id} not found`);
    }
    return doctor;
  }

  async findByName(fullname: string): Promise<DoctorDocument[]> {
    const doctors = await this.doctorModel
      .find({ fullname: new RegExp(fullname, 'i') })
      .exec();
    // if (!doctors || doctors.length === 0) {
    //   throw new NotFoundException(`No doctors found with the name "${fullname}"`);
    // }
    return doctors;
  }
  async findOneByUsername(username: string) {
    const user = await this.doctorModel.findOne({ username });
    return user;
  }
}

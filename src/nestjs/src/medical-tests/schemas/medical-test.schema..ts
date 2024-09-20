import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Appointment } from 'src/appointment/schemas/appointment.schemas';
import { Service } from 'src/medical-services/schemas/service.schema';
import { Doctor } from 'src/person/schemas/doctor.schema';
import { Patient } from 'src/person/schemas/patient.schemas';

export type MedicalTestDocument = HydratedDocument<MedicalTest>;

// Khi tạo yêu cầu, trạng thái ban đầu là "Awaiting Payment".
// Sau khi thanh toán thành công, chuyển thành "Paid".
// Khi dịch vụ bắt đầu, chuyển thành "In Progress".
// Sau khi hoàn thành dịch vụ, chuyển thành "Completed".
// Nếu cần, có thể chuyển sang trạng thái "Cancelled" khi yêu cầu bị hủy.
@Schema({ timestamps: true })
export class MedicalTest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Service' })
  service: Service;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctor: Doctor;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' })
  appointment: Appointment;
  @Prop({ type: String, default: 'Awaiting Payment' })
  status: string;
  @Prop({ type: String })
  initialDiagnosis: string;
  @Prop({ type: String, default: '' })
  notes: string;
  @Prop({ type: String })
  conclude: string;
  @Prop({ default: [] })
  attachments: string[];
}

export const MedicalTestSchema = SchemaFactory.createForClass(MedicalTest);

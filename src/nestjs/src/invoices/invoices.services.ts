import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  private async generateInvoiceId(): Promise<string> {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const invoiceCount = await this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const orderNumber = (invoiceCount + 1).toString().padStart(4, '0');
    return `INV${datePart}${orderNumber}`; // Ví dụ: INV202410310001
  }

  // Hàm tính tổng cộng từng dòng và tổng tiền hóa đơn
  private calculateTotals(
    medicines?: any[],
    services?: any[],
  ): { medicines: any[]; services: any[]; totalAmount: number } {
    let totalAmount = 0;

    // Tính totalPrice cho từng dòng thuốc
    const updatedMedicines =
      medicines?.map((med) => {
        const totalPrice = med.unitPrice * med.quantity;
        totalAmount += totalPrice;
        return { ...med, totalPrice };
      }) || [];

    // Tính totalPrice cho từng dòng dịch vụ
    // const updatedServices =
    //   services?.map((service) => {
    //     const totalPrice = service.unitPrice; // Giả sử dịch vụ không có quantity
    //     totalAmount += totalPrice;
    //     return { ...service, totalPrice };
    //   }) || [];

    return {
      medicines: updatedMedicines,
      services: [],
      totalAmount,
    };
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceId = await this.generateInvoiceId();

    const { medicines, services, totalAmount } = this.calculateTotals(
      createInvoiceDto.medicines,
      createInvoiceDto.services,
    );

    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      invoiceId,
      medicines,
      services,
      totalAmount,
    });
    return await newInvoice.save();
  }

  async changeToPaid(id: string): Promise<any> {
    const rs = await this.invoiceModel
      .findByIdAndUpdate(id, { status: 'paid' }, { new: true })
      .exec();

    return rs;
  }
}

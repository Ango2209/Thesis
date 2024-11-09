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

    const updatedServices =
      services?.map((service) => {
        const totalPrice = service.unitPrice;
        totalAmount += totalPrice;
        return { ...service, totalPrice };
      }) || [];

    return {
      medicines: updatedMedicines,
      services: updatedServices,
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

  async getLast7DaysRevenue() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 7 ngày gần nhất

    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - 7); // 7 ngày trước đó
    const previousEndDate = new Date(startDate);

    // Doanh thu cho 7 ngày gần nhất chỉ bao gồm hóa đơn đã thanh toán
    const recentRevenueData = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: 'paid', // Chỉ tính các hóa đơn đã thanh toán
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // Doanh thu cho 7 ngày trước đó chỉ bao gồm hóa đơn đã thanh toán
    const previousRevenueData = await this.invoiceModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousStartDate,
            $lte: previousEndDate,
          },
          status: 'paid', // Chỉ tính các hóa đơn đã thanh toán
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Tạo mảng dữ liệu ngày và đảm bảo tất cả các ngày đều có giá trị
    const chartData = [];
    const labels = [];
    let totalAmount = 0;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      // Tìm doanh thu của ngày hiện tại, nếu không có thì gán bằng 0
      const dayRevenue = recentRevenueData.find(
        (day) => day._id.date === dateString,
      );
      const revenue = dayRevenue ? dayRevenue.totalRevenue : 0;

      chartData.push(revenue);
      labels.push(dateString);
      totalAmount += revenue;
    }

    // Tính tỷ lệ thay đổi so với 7 ngày trước đó
    const previousTotal = previousRevenueData[0]?.totalRevenue || 0;
    const percentage = previousTotal
      ? ((totalAmount - previousTotal) / previousTotal) * 100
      : 0;

    return {
      title: 'Revenue in the Last 7 Days',
      value: totalAmount + '₫',
      chartData,
      labels,
      percentage: Math.round(percentage * 100) / 100, // Làm tròn hai chữ số thập phân
    };
  }

  async getMonthlyRevenueByYear(year: string) {
    const yearParam = typeof year === 'string' ? parseInt(year, 10) : year;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Truy vấn các hóa đơn "paid" cho năm cần thống kê
    const invoices = await this.invoiceModel.find({
      status: 'paid',
      createdAt: {
        $gte: new Date(`${yearParam}-01-01`),
        $lt: new Date(`${yearParam + 1}-01-01`),
      },
    });

    // Khởi tạo earningsChartData cho các tháng đã qua nếu là năm hiện tại, hoặc đủ 12 tháng nếu là năm khác
    const earningsChartData = Array(
      yearParam === currentYear ? currentMonth : 12,
    ).fill(0);

    // Tính doanh thu cho từng tháng từ hóa đơn
    invoices.forEach((invoice) => {
      const month = invoice.createdAt.getMonth(); // Tháng dạng 0-11
      if (yearParam === currentYear && month >= currentMonth) return; // Bỏ qua tháng tương lai của năm hiện tại

      earningsChartData[month] += invoice.totalAmount; // Cộng dồn doanh thu vào tháng tương ứng
    });

    // Trả về đối tượng với cấu trúc mong muốn
    return {
      title: `Monthly Revenue for Year ${year}`,
      year: year,
      earningsChartData,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/dto';
import {
  Medicine,
  MedicineDocument,
} from 'src/medicine/schemas/medicine.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Medicine.name)
    private readonly medicineModel: Model<MedicineDocument>,
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

    // Tạo một hàm con để tính doanh thu cho các điều kiện khác nhau
    const getRevenueData = async (invoiceType?: string) => {
      const matchCondition: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        status: 'paid',
      };
      if (invoiceType) matchCondition.invoiceType = invoiceType;

      const recentRevenueData = await this.invoiceModel.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
            },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { '_id.date': 1 } },
      ]);

      // Doanh thu cho 7 ngày trước đó
      const previousRevenueData = await this.invoiceModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousStartDate,
              $lte: previousEndDate,
            },
            status: 'paid',
            ...(invoiceType && { invoiceType }),
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
      const percentage = ((totalAmount - previousTotal) / previousTotal) * 100;

      return {
        title: invoiceType
          ? `Revenue for ${invoiceType} in Last 7 Days`
          : 'Total Revenue in Last 7 Days',
        value: totalAmount + '₫',
        chartData,
        labels,
        percentage: Math.round(percentage * 100) / 100, // Làm tròn hai chữ số thập phân
      };
    };

    // Tính toán ba loại doanh thu
    const totalRevenue = await getRevenueData();
    const medicineRevenue = await getRevenueData('medicine');
    const serviceRevenue = await getRevenueData('service');

    // Trả về kết quả dưới dạng mảng
    return [medicineRevenue, serviceRevenue, totalRevenue];
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

  async getTopItems(startDate: Date, endDate: Date, type: string) {
    // Khởi tạo pipeline
    const pipeline: any[] = [];

    // Giai đoạn $match
    const matchStage: Record<string, any> = {
      createdAt: { $gte: startDate, $lte: endDate },
    };
    if (type === 'medicine') {
      matchStage['medicines'] = { $exists: true, $ne: [] };
    } else if (type === 'service') {
      matchStage['services'] = { $exists: true, $ne: [] };
    }
    pipeline.push({ $match: matchStage });

    // Giai đoạn $unwind
    pipeline.push({
      $unwind: type === 'medicine' ? '$medicines' : '$services',
    });

    // Giai đoạn $group
    const groupStage: Record<string, any> = {
      _id:
        type === 'medicine' ? '$medicines.medicineId' : '$services.serviceId',
      totalQuantity: { $sum: type === 'medicine' ? '$medicines.quantity' : 1 },
    };
    pipeline.push({ $group: groupStage });

    // Giai đoạn $sort và $limit
    pipeline.push({ $sort: { totalQuantity: -1 } });
    pipeline.push({ $limit: 5 });

    // Giai đoạn $lookup
    pipeline.push({
      $lookup: {
        from: type === 'medicine' ? 'medicines' : 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'itemDetails',
      },
    });

    // Giai đoạn $project
    pipeline.push({
      $project: {
        name: { $arrayElemAt: ['$itemDetails.name', 0] },
        totalQuantity: 1,
      },
    });

    return this.invoiceModel.aggregate(pipeline);
  }

  async getDetailedMedicineData(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Truy vấn tổng hợp để lấy dữ liệu chi tiết các loại thuốc, bao gồm cả những thuốc không có trong hóa đơn
    const result = await this.medicineModel.aggregate([
      // Bước 1: Kết hợp với bảng `Invoice` để lấy dữ liệu về số lượng bán và doanh thu
      {
        $lookup: {
          from: 'invoices',
          let: { medicineId: '$_id' },
          pipeline: [
            {
              $match: { createdAt: { $gte: start, $lte: end }, status: 'paid' },
            },
            { $unwind: '$medicines' },
            {
              $match: {
                $expr: { $eq: ['$medicines.medicineId', '$$medicineId'] },
              },
            },
            {
              $group: {
                _id: '$medicines.medicineId',
                totalQuantitySold: { $sum: '$medicines.quantity' },
                totalRevenue: { $sum: '$medicines.totalPrice' },
              },
            },
          ],
          as: 'invoiceData',
        },
      },
      {
        $unwind: {
          path: '$invoiceData',
          preserveNullAndEmptyArrays: true, // Đảm bảo các thuốc không có trong hóa đơn vẫn xuất hiện
        },
      },
      // Bước 2: Kết hợp với bảng `Batch` để lấy thông tin tồn kho và giá nhập trung bình
      {
        $lookup: {
          from: 'batches',
          localField: '_id',
          foreignField: 'medicineId',
          as: 'batchDetails',
        },
      },
      // Bước 3: Tính tổng số lượng tồn kho và giá nhập trung bình từ các lô
      {
        $addFields: {
          stockQuantity: { $sum: '$batchDetails.quantity' },
          avgPurchasePrice: { $avg: '$batchDetails.purchasePrice' },
          totalQuantitySold: { $ifNull: ['$invoiceData.totalQuantitySold', 0] },
          totalRevenue: { $ifNull: ['$invoiceData.totalRevenue', 0] },
        },
      },
      // Bước 4: Tính toán lợi nhuận (doanh thu - giá vốn)
      {
        $addFields: {
          profit: {
            $subtract: [
              '$totalRevenue',
              { $multiply: ['$totalQuantitySold', '$avgPurchasePrice'] },
            ],
          },
        },
      },
      // Bước 5: Chọn các trường cần thiết
      {
        $project: {
          _id: 0,
          medicineId: '$_id',
          medicineName: '$name',
          basePrice: '$basePrice',
          totalQuantitySold: 1,
          totalRevenue: 1,
          profit: 1,
          stockQuantity: 1,
          avgPurchasePrice: 1,
        },
      },
      // Bước 6: Sắp xếp theo tổng số lượng bán giảm dần
      { $sort: { totalQuantitySold: -1 } },
    ]);

    return result;
  }
}

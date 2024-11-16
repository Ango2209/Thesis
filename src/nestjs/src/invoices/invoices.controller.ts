import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoices.services';
import { CreateInvoiceDto } from './dto/dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.create(createInvoiceDto);
  }

  @Patch(':id/change-to-paid')
  async changeToPaid(@Param('id') id: string) {
    return await this.invoiceService.changeToPaid(id);
  }

  @Get('last-7-days-revenue')
  async getLast7DaysRevenue() {
    return await this.invoiceService.getLast7DaysRevenue();
  }

  @Get('monthly-revenue')
  async getMonthlyRevenueByYear(@Query('year') year: string) {
    return await this.invoiceService.getMonthlyRevenueByYear(year);
  }
  @Get('top-items')
  async getTopItems(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('type') type: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.invoiceService.getTopItems(start, end, type);
  }

  // Hàm format ngày tháng theo định dạng "dd/MM/yyyy"
  private formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  @Get('medicines-excel')
  async exportMedicinesToExcel(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.invoiceService.getDetailedMedicineData(
        startDate,
        endDate,
      );
      const today = new Date().toLocaleDateString().replace(/\//g, '-');

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Medicines Report');

      // Title and export date
      worksheet.addRow([
        `Medicines Details Report from ${this.formatDateString(startDate)} to ${this.formatDateString(endDate)}`,
      ]);
      worksheet.addRow([`Export Date: ${today}`]);
      worksheet.addRow([]);

      // Header row
      const headerRow = worksheet.addRow([
        'Medicine Name',
        'Base Price',
        'Quantity Sold',
        'Total Revenue',
        'Profit',
        'Stock Quantity',
        'Avg Purchase Price',
      ]);

      // Apply styles to the header row
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12 };
        cell.alignment = { horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' }, // Yellow background
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Add data rows and apply borders
      data.forEach((item, index) => {
        const row = worksheet.addRow([
          item.medicineName,
          item.basePrice,
          item.totalQuantitySold || 0,
          item.totalRevenue || 0,
          item.profit || 0,
          item.stockQuantity || 0,
          item.avgPurchasePrice || 0,
        ]);

        if (index % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F2F2F2' }, // Xám nhạt cho các hàng chẵn
            };
          });
        }

        // Apply VND currency format to relevant columns
        row.getCell(2).numFmt = '#,##0₫'; // Base Price
        row.getCell(4).numFmt = '#,##0₫'; // Total Revenue
        row.getCell(5).numFmt = '#,##0₫'; // Profit
        row.getCell(7).numFmt = '#,##0₫'; // Avg Purchase Price

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // Set column widths for better display
      worksheet.columns = [
        { width: 20 }, // Medicine Name
        { width: 10 }, // Base Price
        { width: 15 }, // Quantity Sold
        { width: 15 }, // Total Revenue
        { width: 10 }, // Profit
        { width: 15 }, // Stock Quantity
        { width: 20 }, // Avg Purchase Price
      ];

      // Merge the title cell across the first row
      worksheet.mergeCells('A1:H1');
      worksheet.getCell('A1').font = { bold: true, size: 18 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      const totalRow = worksheet.addRow([
        'Total',
        '',
        '',
        { formula: `SUM(D5:D${worksheet.lastRow.number})` }, // Total Revenue Sum
        { formula: `SUM(E5:E${worksheet.lastRow.number})` }, // Profit Sum
        '',
        '',
      ]);

      // Apply styles to the total row
      totalRow.getCell(1).font = { bold: true }; // "Total" label
      totalRow.getCell(4).numFmt = '#,##0₫'; // Format Total Revenue as VND
      totalRow.getCell(5).numFmt = '#,##0₫'; // Format Total Profit as VND

      totalRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Page setup for A4 paper size
      worksheet.pageSetup = {
        paperSize: 9, // A4 paper size
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
      };

      // Set print margins for A4 (inches)
      worksheet.pageSetup.margins = {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      };

      // Write to buffer and send response
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Medicines_Report_${today}.xlsx"`,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.end(buffer);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Failed to generate Excel file');
    }
  }
  @Get('services-excel')
  async exportServicesToExcel(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    try {
      // Lấy dữ liệu dịch vụ chi tiết từ Service
      const data = await this.invoiceService.getDetailedServiceData(
        startDate,
        endDate,
      );
      const today = new Date().toLocaleDateString().replace(/\//g, '-');

      // Tạo một workbook và worksheet mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Services Report');

      // Tiêu đề báo cáo và ngày xuất
      worksheet.addRow([
        `Services Details Report from ${this.formatDateString(startDate)} to ${this.formatDateString(endDate)}`,
      ]);
      worksheet.addRow([`Export Date: ${today}`]);
      worksheet.addRow([]);

      // Hàng tiêu đề
      const headerRow = worksheet.addRow([
        'Service Name',
        'Service Price',
        'Usage Count',
        'Total Revenue',
      ]);

      // Áp dụng style cho hàng tiêu đề
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12 };
        cell.alignment = { horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' }, // Yellow background
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Thêm các hàng dữ liệu và áp dụng định dạng tiền tệ cho các cột liên quan
      data.forEach((item, index) => {
        const row = worksheet.addRow([
          item.serviceName,
          item.servicePrice,
          item.usageCount || 0,
          item.totalRevenue || 0,
        ]);

        // Áp dụng màu nền xen kẽ cho các hàng dữ liệu
        if (index % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F2F2F2' }, // Xám nhạt cho các hàng chẵn
            };
          });
        }

        // Định dạng các cột tiền tệ với VND
        row.getCell(2).numFmt = '#,##0₫'; // Service Price
        row.getCell(4).numFmt = '#,##0₫'; // Total Revenue

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // Thiết lập độ rộng cột để hiển thị đẹp hơn
      worksheet.columns = [
        { width: 20 }, // Service Name
        { width: 15 }, // Service Price
        { width: 15 }, // Usage Count
        { width: 20 }, // Total Revenue
      ];

      // Gộp các ô tiêu đề để căn giữa
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').font = { bold: true, size: 14 };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Thêm hàng tổng cho Total Revenue
      const totalRow = worksheet.addRow([
        'Total',
        '',
        '',
        { formula: `SUM(D5:D${worksheet.lastRow.number})` }, // Tổng doanh thu
      ]);

      // Áp dụng style cho hàng tổng
      totalRow.getCell(1).font = { bold: true }; // "Total" label
      totalRow.getCell(4).numFmt = '#,##0₫'; // Format Total Revenue as VND

      totalRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Thiết lập trang cho khổ giấy A4
      worksheet.pageSetup = {
        paperSize: 9, // A4
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
      };

      // Thiết lập lề trang in cho khổ A4
      worksheet.pageSetup.margins = {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      };

      // Ghi workbook ra buffer và gửi response
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Services_Report_${today}.xlsx"`,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.end(buffer);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Failed to generate Excel file');
    }
  }
}

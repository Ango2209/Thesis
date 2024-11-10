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
        'Medicine ID',
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
          fgColor: { argb: 'FFFF00' }, // Yellow background
        };
      });

      // Add data rows
      data.forEach((item) => {
        worksheet.addRow([
          item.medicineId,
          item.medicineName,
          item.basePrice,
          item.totalQuantitySold || 0,
          item.totalRevenue || 0,
          item.profit || 0,
          item.stockQuantity || 0,
          item.avgPurchasePrice || 0,
        ]);
      });

      // Column widths for better display
      worksheet.columns = [
        { width: 20 }, // Medicine ID
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
}

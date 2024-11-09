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
}

import {
  Body,
  Controller,
  Injectable,
  Param,
  Patch,
  Post,
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
}

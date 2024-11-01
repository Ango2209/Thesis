import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { InvoiceController } from './invoices.controller';
import { InvoiceService } from './invoices.services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoicesModule {}

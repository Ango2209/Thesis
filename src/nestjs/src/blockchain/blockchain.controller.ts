import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('add')
  async addMedicalRecord(
    @Body('patientId') patientId: string,
    @Body('recordDate') recordDate: string,
    @Body('recordHash') recordHash: string,
    @Body('doctorId') doctorId: string,
  ) {
    const result = await this.blockchainService.addMedicalRecord(
      patientId,
      recordDate,
      recordHash,
      doctorId,
    );
    return { success: true, result };
  }

  @Get(':patientId')
  getMedicalRecords(@Param('patientId') patientId: string) {
    return this.blockchainService.getMedicalRecords(patientId);
  }
}

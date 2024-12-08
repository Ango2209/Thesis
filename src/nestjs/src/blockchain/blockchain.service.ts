// blockchain.service.ts
import { Injectable } from '@nestjs/common';
import * as contractABI from './abi.json';
import { Worker } from 'worker_threads';
import Web3 from 'web3';

@Injectable()
export class BlockchainService {
  private web3: Web3;
  private contract: any;
  private contractAddress: string;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.INFURA_URL),
    );
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.contract = new this.web3.eth.Contract(
      contractABI,
      this.contractAddress,
    );
  }

  async addMedicalRecord(
    patientId: string,
    recordDate: string,
    recordHash: string,
    doctorId: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const workerData = { patientId, recordDate, recordHash, doctorId };

      // Tạo Worker Thread
      const worker = new Worker('./src/blockchain/blockchain.worker.js', {
        workerData,
      });

      // Nhận kết quả từ Worker
      worker.on('message', (message) => {
        if (message.status === 'success') {
          resolve(message.transactionHash); // Trả về transaction hash
        } else {
          reject(new Error(message.error)); // Trả về lỗi
        }
      });

      // Bắt lỗi từ Worker
      worker.on('error', (error) => {
        reject(error);
      });

      // Lắng nghe sự kiện kết thúc Worker
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async getMedicalRecords(patientId: string) {
    try {
      const records = await this.contract.methods
        .getMedicalRecords(patientId)
        .call();

      return records.map((record: any) => ({
        recordDate: record[0],
        recordHash: record[1],
        doctorId: record[2],
      }));
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw new Error('Unable to fetch medical records');
    }
  }
}

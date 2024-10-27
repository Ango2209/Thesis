// blockchain.service.ts
import { Injectable } from '@nestjs/common';
import * as contractABI from './abi.json';
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
  ) {
    const account = this.web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY,
    );
    this.web3.eth.accounts.wallet.add(account);
    this.web3.eth.defaultAccount = account.address;

    const data = this.contract.methods
      .addMedicalRecord(patientId, recordDate, recordHash, doctorId)
      .encodeABI();

    const gasPrice = await this.web3.eth.getGasPrice(); // Lấy giá gas hiện tại
    const gas = await this.web3.eth.estimateGas({
      to: this.contract.options.address,
      data: data,
      from: account.address,
    });

    const tx = {
      to: this.contract.options.address,
      data: data,
      gas: gas,
      gasPrice: gasPrice,
      from: account.address,
    };

    const signed = await this.web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY,
    );

    const receipt = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    );

    return {
      transactionHash: receipt.transactionHash.toString(),
      status: receipt.status.toString(),
    };
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

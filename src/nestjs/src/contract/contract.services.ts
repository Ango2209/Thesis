import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServices } from "src/common/base.services";
import { Contract, ContractDocument } from "./schemas/contract.schemas";

@Injectable()
export class ContractService extends BaseServices<ContractDocument> {
    constructor(@InjectModel(Contract.name) private contractModel: Model<ContractDocument>) {
        super(contractModel)
    }
}

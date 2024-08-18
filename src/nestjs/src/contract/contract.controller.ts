import { Controller, Injectable } from "@nestjs/common";
import { BaseServices } from "src/common/base.services";
import { BaseController } from "src/common/base.controller";
import { ContractDocument } from "./schemas/contract.schemas";
import { ContractService } from "./contract.services";


@Controller('contract')
export class ContractController extends BaseController<ContractDocument> {
    constructor(private readonly contactService: ContractService) {
        super(contactService);
    }
}
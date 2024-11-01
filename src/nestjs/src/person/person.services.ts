import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Person,PersonDocument } from "./schemas/person.schemas";
import { BaseServices } from "src/common/base.services";
import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
@Injectable()
export class PersonService extends BaseServices<PersonDocument> {
    constructor(@InjectModel(Person.name) private personModel: Model<PersonDocument>) {
        super(personModel)
    }
    async findOneByUsername(username: string) {
        const user = await this.personModel.findOne({ username });
        return user;
      }
}

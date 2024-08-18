import { Controller } from '@nestjs/common';

import { BaseController } from '../common/base.controller';
import { DoctorService } from './doctor.services';
import { DoctorDocument } from './schemas/doctor.schema';

@Controller('doctors')
export class DoctorController extends BaseController<DoctorDocument> {
    constructor(private readonly doctorService: DoctorService) {
        super(doctorService);
    }
}

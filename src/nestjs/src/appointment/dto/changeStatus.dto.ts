import { IsString, IsIn } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  @IsIn(
    ['booked', 'waiting', 'examining', 'finished', 'medicined', 'cancelled'],
    {
      message:
        'Invalid status. Valid statuses are: booked, waiting, examining, finished, medicined, cancelled',
    },
  )
  status: string;
}

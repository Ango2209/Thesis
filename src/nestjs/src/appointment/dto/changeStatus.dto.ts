import { IsString, IsIn } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  @IsIn(
    ['booked', 'waiting', 'examining', 'finished', 'medicined', 'cancelled', "awaiting results"],
    {
      message:
        'Invalid status. Valid statuses are: booked, waiting, examining, finished, medicined, cancelled',
    },
  )
  status: string;
}

export class ServiceResponseDto {
  id: string;
  name: string;
  price: number;
  status: string;
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

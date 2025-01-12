import { IsInt } from 'class-validator';

export class ChangeOrderItemDto {
    @IsInt()
    id?: number;

    @IsInt()
    order?: number;
}
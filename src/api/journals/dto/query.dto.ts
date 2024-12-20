import { IsIn, IsNumberString, Length } from "class-validator";

export class CalenderQuery {
    @IsNumberString()
    @IsIn(Array(12).fill(undefined).map((_, i) => (i + 1).toString().padStart(2, '0')), { message: 'month invalid' })
    month?: string;

    @IsNumberString()
    @Length(4, 4, { message: 'Year must be exactly 4 digits.' }) // Harus tepat 4 digit
    year?: string
}
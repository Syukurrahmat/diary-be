import { IsIn, IsNumberString, IsOptional, Length } from "class-validator";

export class CalenderQuery {
    @IsOptional()
    @IsNumberString()
    @IsIn(Array(12).fill(undefined).map((_, i) => (i + 1).toString().padStart(2, '0')), { message: 'month invalid' })
    month?: string;

    @IsOptional()
    @IsNumberString()
    @Length(4, 4, { message: 'Year must be exactly 4 digits.' })
    year?: string
  
    @IsOptional()
    @IsNumberString()
    @Length(4, 4, { message: 'Year must be exactly 4 digits.' })
    decade?: string


}
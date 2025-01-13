import { IsDateString, IsNumberString, IsOptional } from "class-validator";

export class CalenderQuery {
    @IsOptional()
    @IsNumberString()
    @IsDateString()
    month?: string;
}
import { IsDateString, IsIn, IsOptional, IsString, ValidateBy, ValidateIf } from "class-validator";
import * as moment from "moment-timezone";

export class QueryEntriesDto {
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsString()
    @IsIn(moment.tz.names(), { message: 'Invalid timezone. Please provide a valid IANA timezone.' })
    tz?: string
}
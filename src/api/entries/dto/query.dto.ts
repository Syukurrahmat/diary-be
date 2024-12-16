import { IsDateString } from "class-validator";

export class QueryEntriesDto {
    @IsDateString()
    date?: string
}
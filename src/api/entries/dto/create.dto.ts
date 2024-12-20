import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreateEntriesDto {
    @IsString()
    content?: string

    @IsDate()
    datetime?: Date

    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber({}, { each: true, },)
    location?: [number, number];

    @IsArray()
    @IsString({ each: true })
    images?: string[]
   
    @IsArray()
    @IsString({ each: true })
    tags?: string[]
}
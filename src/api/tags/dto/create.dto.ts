import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"

export class CreateCategoryDto {
    @IsString()
    name?: string
}
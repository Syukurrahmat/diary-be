import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"

export class CreateHabitDto {
    @IsString()
    name?: string
}
import { IsBoolean, IsNumber, IsOptional, IsString, Matches, ValidateIf } from "class-validator"

export class CreateHabitDto {
    @IsString()
    name?: string
    
    @IsString()
    icon?: string
   
    @IsString()
    @Matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { message: 'color must be a valid hex color code.' })
    color?: string
}
import { IsArray, IsDate, IsDateString, IsInt, IsNumber, IsString } from "class-validator"

export class CreateJournalDto {
    @IsString()
    content?: string

    @IsArray()
    @IsInt({ each: true })
    habits?: number[]

    @IsDate()
    date?: Date
}

export class DateQuery {
    @IsDateString()
    date?: string
}
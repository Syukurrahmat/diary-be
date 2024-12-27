import { Transform } from "class-transformer";
import { IsNumber, IsNumberString, IsString } from "class-validator";

export class SearchQuery {
    @IsString()
    q?: string;
}
 
import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import moment from "moment-timezone";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name?: string;
  
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    password?: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(moment.tz.names(), { message: 'Invalid timezone name' })
    timezone?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitDto } from './create.dto';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {}

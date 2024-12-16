import { PartialType } from '@nestjs/mapped-types';
import { CreateEntriesDto } from './create.dto';

export class UpdateEntriesDto extends PartialType(CreateEntriesDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateJournalDto } from "./create.dto"

export class UpdateJournalDto extends PartialType(CreateJournalDto) { }
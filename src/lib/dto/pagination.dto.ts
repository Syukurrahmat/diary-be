// page,
// limit,
// offset: (page - 1) * limit,
// search: searchObj,
// order: [orderItem],

import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, isInt, IsInt, IsOptional, IsString, Max, Min, min } from 'class-validator';

enum Orderby {
    desc = 'desc',
    asc = 'asc',
    DESC = 'DESC',
    ASC = 'ASC',
}

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1

    @IsOptional()
    @IsInt()
    @Min(10)
    @Max(100)
    @Type(() => Number)
    limit: number = 10


    @IsOptional()
    @IsString()
    sort?: string;


    @IsOptional()
    @IsEnum(Orderby)
    order: 'desc' | 'asc' | 'DESC' | "ASC" = 'asc'


    @IsOptional()
    @IsString()
    search?: string;

    get skip() {
        return (this.page - 1) * this.limit;
    }

    get paginationObj() {
        const orderBy = this.sort ? { [this.sort]: this.order } : undefined
        const skip = (this.page - 1) * this.limit;

        return {
            take: this.limit,
            skip,
            orderBy,
        }
    }

    getMetaData(pagination : PaginationQueryDto, total: number) {
        const {limit, page, search,} = pagination
        
        const totalPage = Math.ceil(total / limit)

        return {
            total,
            totalPage,
            page: page,
            search: search,
            limit: limit,
            prev: page > 1 ? page - 1 : null,
            next: page < totalPage ? page + 1 : null,
        }
    }
}

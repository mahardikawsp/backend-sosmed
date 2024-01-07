// src/common/dtos/query-pagination.dto.ts

import { IsNumberString, IsOptional } from 'class-validator';

export class QuerySearchDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  size?: string;

  keyword: string;
}
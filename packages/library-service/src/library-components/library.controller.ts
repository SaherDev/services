import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  async create(@Body() body: { name: string; data: any }) {
    return this.libraryService.createLibraryObject(
      body?.name ?? 'library',
      body.data
    );
  }

  @Get()
  async get(@Query('id') id: string, @Query('name') name: string) {
    return this.libraryService.findLibraryObject(name ?? 'library', {
      id,
    });
  }
}

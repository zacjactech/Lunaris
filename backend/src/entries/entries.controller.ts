import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Controller('api/entries')
@UseGuards(JwtAuthGuard)
export class EntriesController {
  constructor(private entriesService: EntriesService) {}

  @Post()
  async create(@Request() req, @Body() createEntryDto: CreateEntryDto) {
    return await this.entriesService.create(req.user.id, createEntryDto);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.entriesService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.entriesService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return await this.entriesService.update(id, req.user.id, updateEntryDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.entriesService.delete(id, req.user.id);
    return { message: 'Entry deleted successfully' };
  }
}

import { Body, Delete, Get, RouteParamMetadata, Patch, Post, Param } from "@nestjs/common";
import { BaseServices } from "./base.services";
import { Document } from "mongoose";

export class BaseController<T extends Document> {
    constructor(private readonly baseService: BaseServices<T>) { }

    @Post()
    async create(@Body() createDto: any): Promise<T> {
        return this.baseService.create(createDto)
    }

    @Get()
    async findAll(): Promise<T[]> {
        return this.baseService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<T> {
        return this.baseService.findOne(id)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: any): Promise<T> {
        return this.baseService.update(id, updateDto)
    }

    @Delete('id')
    async delete(@Param('id') id: string): Promise<T> {
        return this.baseService.delete(id)
    }

}
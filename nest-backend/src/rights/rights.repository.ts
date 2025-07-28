import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';
import { Right } from './entities/right.entity';

@Injectable()
export class RightsRepository {
  constructor(
    @InjectRepository(Right)
    private readonly repository: Repository<Right>,
  ) {}

  async create(createRightDto: CreateRightDto): Promise<Right> {
    const right = this.repository.create(createRightDto);
    return await this.repository.save(right);
  }

  async findAll(): Promise<Right[]> {
    return await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Right | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<Right>,
    });
  }

  async findByCategory(category: string): Promise<Right[]> {
    return await this.repository.find({
      where: { category } as FindOptionsWhere<Right>,
      order: {
        name: 'ASC',
      },
    });
  }

  async findByName(name: string): Promise<Right | null> {
    return await this.repository.findOne({
      where: { name } as FindOptionsWhere<Right>,
    });
  }

  async update(
    id: number,
    updateRightDto: UpdateRightDto,
  ): Promise<Right | null> {
    const updateResult = await this.repository.update(id, {
      ...updateRightDto,
      updatedAt: new Date(),
    });

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as FindOptionsWhere<Right>,
    });
    return count > 0;
  }

  async bulkCreate(createRightDtos: CreateRightDto[]): Promise<Right[]> {
    const rights = this.repository.create(createRightDtos);
    return await this.repository.save(rights);
  }

  async bulkDelete(ids: number[]): Promise<boolean> {
    const deleteResult = await this.repository.delete(ids);
    return deleteResult.affected > 0;
  }

  async searchByText(searchTerm: string): Promise<Right[]> {
    return await this.repository
      .createQueryBuilder('right')
      .where('right.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('right.description ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('right.category ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('right.name', 'ASC')
      .getMany();
  }
}

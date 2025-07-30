import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';
import { RightEntity } from './entities/right.entity';

@Injectable()
export class RightsRepository {
  constructor(
    @InjectRepository(RightEntity)
    private readonly repository: Repository<RightEntity>,
  ) {}

  async create(createRightDto: CreateRightDto): Promise<RightEntity> {
    const right = this.repository.create(createRightDto);
    return await this.repository.save(right);
  }

  async findAll(): Promise<RightEntity[]> {
    return await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<RightEntity | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<RightEntity>,
    });
  }

  async findByCategory(category: string): Promise<RightEntity[]> {
    return await this.repository.find({
      where: { category } as FindOptionsWhere<RightEntity>,
      order: {
        name: 'ASC',
      },
    });
  }

  async findByName(name: string): Promise<RightEntity | null> {
    return await this.repository.findOne({
      where: { name } as FindOptionsWhere<RightEntity>,
    });
  }

  async update(
    id: number,
    updateRightDto: UpdateRightDto,
  ): Promise<RightEntity | null> {
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
      where: { id } as FindOptionsWhere<RightEntity>,
    });
    return count > 0;
  }

  async bulkCreate(createRightDtos: CreateRightDto[]): Promise<RightEntity[]> {
    const rights = this.repository.create(createRightDtos);
    return await this.repository.save(rights);
  }

  async bulkDelete(ids: number[]): Promise<boolean> {
    const deleteResult = await this.repository.delete(ids);
    return deleteResult.affected > 0;
  }

  async searchByText(searchTerm: string): Promise<RightEntity[]> {
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

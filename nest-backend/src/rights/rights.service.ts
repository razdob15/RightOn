import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RightsRepository } from './rights.repository';
import * as fs from 'fs';
import { Right } from './entities/right.entity';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';
import { User } from '@righton/shared';
import { isConditionMatch } from '../functions/conditions-validations';

@Injectable()
export class RightsService {
  constructor(private readonly rightsRepository: RightsRepository) {}

  async setup(): Promise<void> {
    const data = fs.readFileSync('rights.json', 'utf-8');
    const rights: CreateRightDto[] = JSON.parse(data);
    for (const right of rights) {
      try {
        await this.create(right);
      } catch (error) {
        if (error instanceof ConflictException) {
          console.log(
            `Right with name '${right.name}' already exists, skipping`,
          );
          // Print the difference between the new one and the one already in the db
          const existingRight = await this.rightsRepository.findByName(
            right.name,
          );
          if (existingRight) {
            const differences = Object.entries(right)
              .filter(([key, value]) => existingRight[key] !== value)
              .map(([key, value]) => ({
                field: key,
                newValue: value,
                existingValue: existingRight[key],
              }));
            if (differences.length > 0) {
              console.log(
                `Differences for right '${right.name}':`,
                differences,
              );
              this.rightsRepository.update(existingRight.id, right);
            } else {
              console.log(`No differences for right '${right.name}'.`);
            }
          }
          continue;
        }
        throw error;
      }
    }
    console.log('Rights setup completed');
  }

  async create(createRightDto: CreateRightDto): Promise<Right> {
    // Check if a right with the same name already exists
    const existingRight = await this.rightsRepository.findByName(
      createRightDto.name,
    );
    if (existingRight) {
      throw new ConflictException(
        `Right with name '${createRightDto.name}' already exists`,
      );
    }

    return await this.rightsRepository.create(createRightDto);
  }

  async findAll(): Promise<Right[]> {
    return await this.rightsRepository.findAll();
  }

  async findOne(id: number): Promise<Right> {
    const right = await this.rightsRepository.findOne(id);
    if (!right) {
      throw new NotFoundException(`Right with ID ${id} not found`);
    }
    return right;
  }

  async findByCategory(category: string): Promise<Right[]> {
    return await this.rightsRepository.findByCategory(category);
  }

  async update(id: number, updateRightDto: UpdateRightDto): Promise<Right> {
    // Check if the right exists
    const exists = await this.rightsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Right with ID ${id} not found`);
    }

    // If updating name, check for conflicts
    if (updateRightDto.name) {
      const existingRight = await this.rightsRepository.findByName(
        updateRightDto.name,
      );
      if (existingRight && existingRight.id !== id) {
        throw new ConflictException(
          `Right with name '${updateRightDto.name}' already exists`,
        );
      }
    }

    const updatedRight = await this.rightsRepository.update(id, updateRightDto);
    if (!updatedRight) {
      throw new NotFoundException(`Right with ID ${id} not found`);
    }
    return updatedRight;
  }

  async remove(id: number): Promise<void> {
    const exists = await this.rightsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Right with ID ${id} not found`);
    }

    const deleted = await this.rightsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Right with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return await this.rightsRepository.count();
  }

  async bulkCreate(createRightDtos: CreateRightDto[]): Promise<Right[]> {
    // Validate that all names are unique
    const names = createRightDtos.map((dto) => dto.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      throw new ConflictException(
        'Duplicate names found in bulk creation request',
      );
    }

    // Check for existing rights with the same names
    for (const dto of createRightDtos) {
      const existingRight = await this.rightsRepository.findByName(dto.name);
      if (existingRight) {
        throw new ConflictException(
          `Right with name '${dto.name}' already exists`,
        );
      }
    }

    return await this.rightsRepository.bulkCreate(createRightDtos);
  }

  async search(searchTerm: string): Promise<Right[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return await this.findAll();
    }
    return await this.rightsRepository.searchByText(searchTerm.trim());
  }

  async getMatchedRights(user: User): Promise<Right[]> {
    const rights = await this.findAll();
    const matchedRights = rights.filter((right) => {
      return (
        !right.conditions ||
        right.conditions.length === 0 ||
        right.conditions.some((condition: object) =>
          isConditionMatch(user, condition),
        )
      );
    });

    // This method should implement the logic to match rights based on user status
    // For now, it returns all rights as a placeholder
    return matchedRights;
  }
}

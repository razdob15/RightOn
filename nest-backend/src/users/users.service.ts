import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UsersRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@righton/shared';
import { differenceInYears } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  flattenUser(user: User): Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email: user.personal.email,
      firstName: user.personal.firstName,
      lastName: user.personal.lastName,
      phone: user.personal.phone,
      birthDate: user.general.birthDate,
      soldierType: user.general.soldierType,
      aliyahCountry: user.aliyah.aliyahCountry,
      livingCity: user.general.city,
      aliyahYear: user.aliyah.aliyahYear,
      isOleh: user.aliyah.isOleh,
      parentsAbroad: user.aliyah.parentsAbroad,
      enlistDate: user.army.enlistDate,
      releaseDate: user.army.releaseDate,
      serviceType: user.army.serviceType,
      activityLevel: user.army.activityLevel,
      isCombat: user.army.isCombat,
      housingStatus: user.housing.housingStatus,
      receivesArmyAssistance: user.housing.receivesArmyAssistance,
      distanceToBase: user.housing.distanceToBase,
      currentHousing: user.housing.currentHousing,
      monthsServed: user.army.monthsServed,
      age: user.general.birthDate
        ? differenceInYears(new Date(), new Date(user.general.birthDate))
        : undefined,
    };
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findByEmail(
      userDto.personal.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    console.log('Creating user with data:', userDto);

    // Transform nested DTO to flat entity using the CreateUserEntity class
    const flatUserData = this.flattenUser(userDto);

    console.log('Transformed user entity:', flatUserData);

    return await this.usersRepository.create(flatUserData);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If email is being updated, check if new email is already taken
    if (
      updateUserDto.personal?.email &&
      updateUserDto.personal.email !== existingUser.email
    ) {
      const userWithEmail = await this.usersRepository.findByEmail(
        updateUserDto.personal.email,
      );
      if (userWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Transform nested DTO to flat entity data
    const flatUpdateData = this.flattenUser(updateUserDto);

    const updatedUser = await this.usersRepository.update(id, flatUpdateData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.delete(id);
  }

  async getUsersCount(): Promise<number> {
    return await this.usersRepository.count();
  }
}

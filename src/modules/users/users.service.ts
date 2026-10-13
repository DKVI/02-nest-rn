import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import { skip } from 'node:test';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  isEmailTaken = async (email: string): Promise<boolean> => {
    const user = await this.userModel.exists({ email });
    return !!user;
  };
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPasswordHelper(createUserDto.password);
    if (await this.isEmailTaken(createUserDto.email)) {
      throw new BadRequestException('Email is already taken');
    }
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await createdUser.save();
    return createdUser._id;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .select('-password');
    console.log('results:', results);
    return {
      results,
      totalItems,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
    return `This action updates a #${updateUserDto._id} user`;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const results = await this.userModel.findById(id);
    if (!results) {
      throw new BadRequestException('User not found');
    }
    return this.userModel.deleteOne({ _id: id });
  }
}

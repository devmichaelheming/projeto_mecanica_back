import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel(createUserDto);
      await user.save();
      return { message: "Usuário cadastrado com sucesso." };
    } catch (error) {
      throw new HttpException(
        "Falha ao cadastrar usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar usuários.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException("Usuário não encontrado.");
      }
      return user;
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException("Usuário não encontrado.");
      }
      return { message: "Usuário atualizado com sucesso." };
    } catch (error) {
      throw new HttpException(
        "Falha ao atualizar usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async findUser(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUser(userId: string) {
    const user = await this.findUser(userId);
    if (!user) {
      throw new NotFoundException("Não foi possível encontrar o usuário.");
    }
    return user;
  }

  async delete(id: string) {
    try {
      const user = await this.findUser(id);
      if (!user) {
        throw new NotFoundException("Usuário não encontrado.");
      }
      await this.userModel.deleteOne({ _id: id }).exec();
      return { message: "Usuário removido com sucesso." };
    } catch (error) {
      throw new HttpException(
        "Falha ao remover usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

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
    const errors = [];

    // Verificar se o email já está em uso
    const existingUserByEmail = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUserByEmail) {
      errors.push("O Email já está em uso.");
    }

    // Verificar se o CPF já está em uso
    const existingUserByCpf = await this.userModel
      .findOne({ cpf: createUserDto.cpf })
      .exec();
    if (existingUserByCpf) {
      errors.push("O CPF já está em uso.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro salvar o novo usuário no banco de dados
    const user = new this.userModel(createUserDto);
    await user.save();
    return { message: "Usuário cadastrado com sucesso.", sucesso: true };
  }

  async findAll() {
    try {
      const users = await this.userModel.find().exec();
      if (!users) {
        throw new NotFoundException("Não foram encontrados usuários.");
      }

      const usersWithRenamedId = users.map((client) => {
        const { _id, ...rest } = client.toObject();
        return { id: _id, ...rest };
      });

      return usersWithRenamedId;
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
    const errors = [];

    // Verificar se o email já está em uso
    const existingUserByEmail = await this.userModel
      .findOne({ email: updateUserDto.email })
      .exec();
    if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
      errors.push("Email já está em uso.");
    }

    // Verificar se o CPF já está em uso
    const existingUserByCpf = await this.userModel
      .findOne({ cpf: updateUserDto.cpf })
      .exec();
    if (existingUserByCpf && existingUserByCpf._id.toString() !== id) {
      errors.push("CPF já está em uso.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro atualizar o usuário no banco de dados
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException("Usuário não encontrado.");
    }
    return { message: "Usuário atualizado com sucesso.", sucesso: true };
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
      return { message: "Usuário removido com sucesso.", sucesso: true };
    } catch (error) {
      throw new HttpException(
        "Falha ao remover usuário.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

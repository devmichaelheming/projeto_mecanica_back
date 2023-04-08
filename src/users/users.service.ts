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

  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);

    return user.save().then(() => {
      return {
        message: "Usuário cadastrado com sucesso.",
      };
    });
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        }
      )
      .then(() => {
        return {
          message: "Usuário atualizado com sucesso.",
        };
      });
  }

  async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
      return user || null;
    } catch (error) {
      return null;
    }
  }

  async getUser(userId: string) {
    const user = await this.findUser(userId);
    if (!user) {
      throw new NotFoundException("Não foi possível encontrar o usuário.");
    }
    return user;
  }

  async delete(id: string): Promise<any> {
    try {
      return this.userModel
        .deleteOne({
          _id: id,
        })
        .exec()
        .then(() => {
          return {
            message: "Usuário removido com sucesso.",
          };
        });
    } catch (error) {
      throw new HttpException(
        "Ocorreu um erro ao deletar o usuário.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

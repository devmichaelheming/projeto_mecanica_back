import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client, ClientDocument } from "./entities/client.entity";

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>
  ) {}

  async create(createClientDto: CreateClientDto) {
    const errors = [];

    // Verificar se o email já está em uso
    const existingClientByEmail = await this.clientModel
      .findOne({ email: createClientDto.email })
      .exec();
    if (existingClientByEmail) {
      errors.push("O Email já está em uso.");
    }

    // Verificar se o CPF ou CNPJ já está em uso, dependendo do tipo de pessoa
    if (createClientDto.typePerson === "fisica") {
      const existingClientByCpf = await this.clientModel
        .findOne({ cpf: createClientDto.cpf })
        .exec();
      if (existingClientByCpf) {
        errors.push("O CPF já está em uso.");
      }
      if (!createClientDto.name || !createClientDto.surname) {
        errors.push("Nome e sobrenome são obrigatórios para pessoas físicas.");
      }
    } else if (createClientDto.typePerson === "juridica") {
      const existingClientByCnpj = await this.clientModel
        .findOne({ cnpj: createClientDto.cnpj })
        .exec();
      if (existingClientByCnpj) {
        errors.push("O CNPJ já está em uso.");
      }
      if (!createClientDto.razaoSocial || !createClientDto.nomeFantasia) {
        errors.push(
          "Razão social e nome fantasia são obrigatórios para pessoas jurídicas."
        );
      }
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro salvar o novo cliente no banco de dados
    const client = new this.clientModel(createClientDto);
    await client.save();
    return { message: "Cliente cadastrado com sucesso.", sucesso: true };
  }

  async findAll() {
    try {
      return await this.clientModel.find().exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar clientes.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientModel.findById(id).exec();
      if (!client) {
        throw new NotFoundException("Cliente não encontrado.");
      }
      return client;
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar cliente.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const errors = [];

    // Verificar se o email já está em uso
    const existingClientByEmail = await this.clientModel
      .findOne({ email: updateClientDto.email })
      .exec();
    if (existingClientByEmail && existingClientByEmail._id.toString() !== id) {
      errors.push("Email já está em uso.");
    }

    // Verificar se o CPF já está em uso
    const existingClientByCpf = await this.clientModel
      .findOne({ cpf: updateClientDto.cpf })
      .exec();
    if (existingClientByCpf && existingClientByCpf._id.toString() !== id) {
      errors.push("CPF já está em uso.");
    }

    // Verificar se o CNPJ já está em uso
    const existingClientByCnpj = await this.clientModel
      .findOne({ cnpj: updateClientDto.cnpj })
      .exec();
    if (existingClientByCnpj && existingClientByCnpj._id.toString() !== id) {
      errors.push("CNPJ já está em uso.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro atualizar o cliente no banco de dados
    const updatedClient = await this.clientModel
      .findByIdAndUpdate(id, updateClientDto, { new: true })
      .exec();
    if (!updatedClient) {
      throw new NotFoundException("Cliente não encontrado.");
    }
    return { message: "Cliente atualizado com sucesso.", sucesso: true };
  }

  private async findClient(id: string): Promise<Client> {
    try {
      return await this.clientModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar cliente.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getClient(clientId: string) {
    const client = await this.findClient(clientId);
    if (!client) {
      throw new NotFoundException("Não foi possível encontrar o cliente.");
    }
    return client;
  }

  async delete(id: string) {
    try {
      const client = await this.findClient(id);
      if (!client) {
        throw new NotFoundException("Cliente não encontrado.");
      }
      await this.clientModel.deleteOne({ _id: id }).exec();
      return { message: "Cliente removido com sucesso.", sucesso: true };
    } catch (error) {
      throw new HttpException(
        "Falha ao remover cliente.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

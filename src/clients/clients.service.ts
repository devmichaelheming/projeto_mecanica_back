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
import { v4 as uuidv4 } from "uuid";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { Vehicle } from "./entities/vehicle.entity";

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

    // Verificar se o documento (CPF ou CNPJ) já está em uso
    const existingClientByDocument = await this.clientModel
      .findOne({ document: createClientDto.document })
      .exec();
    if (existingClientByDocument) {
      errors.push(
        `O ${
          createClientDto.typePerson === "fisica" ? "CPF" : "CNPJ"
        } já está em uso.`
      );
    }

    // Verificar se o nome e sobrenome (ou razão social e nome fantasia) são fornecidos
    if (
      (!createClientDto.name || !createClientDto.surname) &&
      createClientDto.typePerson === "fisica"
    ) {
      errors.push("Nome e sobrenome são obrigatórios.");
    } else if (
      createClientDto.typePerson === "juridica" &&
      !createClientDto.razaoSocial
    ) {
      errors.push("Razão social é obrigatória para pessoas jurídicas.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Criar IDs aleatórios para os veículos
    createClientDto.vehicles.forEach((vehicle) => {
      vehicle.id = uuidv4();
    });

    // Crie um novo cliente
    const client = new this.clientModel(createClientDto);
    await client.save();

    return { message: "Cliente cadastrado com sucesso.", sucesso: true };
  }

  // async findAll() {
  //   try {
  //     const clients = await this.clientModel.find().exec();
  //     if (!clients) {
  //       throw new NotFoundException("Não foram encontrados clientes.");
  //     }

  //     const clientsWithRenamedId = clients.map((client) => {
  //       const { _id, ...rest } = client.toObject();
  //       return { id: _id, ...rest };
  //     });

  //     return clientsWithRenamedId;
  //   } catch (error) {
  //     throw new HttpException(
  //       "Falha ao buscar clientes.",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  async findAll() {
    try {
      const clients = await this.clientModel.find().select("-__v").exec();
      if (!clients) {
        throw new NotFoundException("Não foram encontrados clientes.");
      }

      const clientsWithRenamedId = clients.map((client) => {
        const { _id, ...rest } = client.toObject();
        return { id: _id, ...rest };
      });

      return clientsWithRenamedId;
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

    const existingClient = await this.clientModel.findById(id).exec();

    // Verificar se o email já está em uso
    const existingClientByEmail = await this.clientModel
      .findOne({ email: updateClientDto.email })
      .exec();
    if (existingClientByEmail && existingClientByEmail._id.toString() !== id) {
      errors.push("Email já está em uso.");
    }

    // Verificar se o CPF foi fornecido e é diferente do CPF atual do cliente
    if (
      updateClientDto.document &&
      updateClientDto.document !== existingClient.document
    ) {
      const existingClientByCpf = await this.clientModel
        .findOne({ document: updateClientDto.document })
        .exec();
      if (existingClientByCpf && existingClientByCpf._id.toString() !== id) {
        errors.push("CPF já está em uso.");
      }
    }

    // Verificar se o CNPJ foi fornecido e é diferente do CNPJ atual do cliente
    if (
      updateClientDto.document &&
      updateClientDto.document !== existingClient.document
    ) {
      const existingClientByCnpj = await this.clientModel
        .findOne({ document: updateClientDto.document })
        .exec();
      if (existingClientByCnpj && existingClientByCnpj._id.toString() !== id) {
        errors.push("CNPJ já está em uso.");
      }
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

  async activateOrDeactivate(id: string) {
    try {
      const client = await this.findClient(id);
      if (!client) {
        throw new NotFoundException("Cliente não encontrado.");
      }
      await this.clientModel
        .findByIdAndUpdate(id, { active: !client.active }, { new: true })
        .exec();
      return {
        message: `O Cliente '${client.name}' foi ${
          client.active ? "inativado" : "ativado"
        } com sucesso.`,
        sucesso: true,
      };
    } catch (error) {
      throw new HttpException(
        "Falha ao ativar/inativar cliente.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addVehicleToClient(
    clientId: string,
    createVehicleDto: CreateVehicleDto
  ): Promise<{ message: string; sucesso: boolean }> {
    const client = await this.clientModel.findById(clientId).exec();
    if (!client) {
      throw new NotFoundException("Cliente não encontrado.");
    }

    // Gerar um ID único para o veículo usando uuid
    const newVehicleId = uuidv4();
    const newVehicle: Vehicle = {
      id: newVehicleId,
      ...createVehicleDto,
    };

    client.vehicles.push(newVehicle);
    await client.save();

    return { message: "Veículos cadastrado com sucesso.", sucesso: true };
  }

  async getVehiclesOfClient(clientId: string) {
    const client = await this.clientModel.findById(clientId).exec();
    if (!client) {
      throw new NotFoundException("Clientes não encontrados.");
    }

    return client.vehicles;
  }

  async updateVehicleOfClient(
    clientId: string,
    vehicleId: string,
    updateVehicleDto: UpdateVehicleDto
  ): Promise<{ message: string; sucesso: boolean }> {
    const client = await this.clientModel.findById(clientId).exec();
    if (!client) {
      throw new NotFoundException("Cliente não encontrado.");
    }

    // Encontrar o veículo pelo ID
    const vehicleIndex = client.vehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );
    if (vehicleIndex === -1) {
      throw new NotFoundException("Veículo não encontrado.");
    }

    // Atualizar o veículo com os novos dados do DTO
    client.vehicles[vehicleIndex] = {
      ...client.vehicles[vehicleIndex],
      ...updateVehicleDto,
    };

    await client.save();
    return { message: "Veículos atualizado com sucesso.", sucesso: true };
  }

  async deleteVehicleOfClient(clientId: string, vehicleId: string) {
    const client = await this.clientModel.findById(clientId).exec();
    if (!client) {
      throw new NotFoundException("Cliente não encontrado.");
    }

    const vehicleIndex = client.vehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );

    if (vehicleIndex === -1) {
      throw new NotFoundException("Veículo não encontrado.");
    }

    client.vehicles.splice(vehicleIndex, 1);
    await client.save();

    return { message: "Veículo removido com sucesso.", sucesso: true };
  }
}

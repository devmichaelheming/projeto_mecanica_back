import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { Vehicle, VehicleDocument } from "./entities/vehicle.entity";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const errors = [];

    // Verificar se a marca já está em uso
    const existingClientByBrand = await this.vehicleModel
      .findOne({ brand: createVehicleDto.brand })
      .exec();
    if (existingClientByBrand) {
      errors.push("Esta marca já existe.");
    }

    // Verificar se a placa já está em uso
    const existingClientByPlate = await this.vehicleModel
      .findOne({ plate: createVehicleDto.plate })
      .exec();
    if (existingClientByPlate) {
      errors.push("Esta placa já existe.");
    }

    // Verificar se o número do chassi já está em uso
    const existingClientByChassisNumber = await this.vehicleModel
      .findOne({ chassisNumber: createVehicleDto.chassisNumber })
      .exec();
    if (existingClientByChassisNumber) {
      errors.push("Este número do chassi já existe.");
    }

    // Verificar se o número do motor já está em uso
    const existingClientByEngineNumber = await this.vehicleModel
      .findOne({ engineNumber: createVehicleDto.engineNumber })
      .exec();
    if (existingClientByEngineNumber) {
      errors.push("Este número do motor já existe.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro salvar o novo veículo no banco de dados
    const vehicle = new this.vehicleModel(createVehicleDto);
    await vehicle.save();
    return { message: "Veículo cadastrado com sucesso.", sucesso: true };
  }

  async findAll() {
    try {
      return await this.vehicleModel.find().exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar veículos.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const vehicle = await this.vehicleModel.findById(id).exec();
      if (!vehicle) {
        throw new NotFoundException("Veículo não encontrado.");
      }
      return vehicle;
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar veículo.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const errors = [];

    // Verificar se a marca já está em uso
    const existingClientByBrand = await this.vehicleModel
      .findOne({ brand: updateVehicleDto.brand })
      .exec();
    if (existingClientByBrand && existingClientByBrand._id.toString() !== id) {
      errors.push("Esta marca já existe.");
    }

    // Verificar se a placa já está em uso
    const existingClientByPlate = await this.vehicleModel
      .findOne({ plate: updateVehicleDto.plate })
      .exec();
    if (existingClientByPlate && existingClientByPlate._id.toString() !== id) {
      errors.push("Esta placa já existe.");
    }

    // Verificar se o número do chassi já está em uso
    const existingClientByChassisNumber = await this.vehicleModel
      .findOne({ chassisNumber: updateVehicleDto.chassisNumber })
      .exec();
    if (
      existingClientByChassisNumber &&
      existingClientByChassisNumber._id.toString() !== id
    ) {
      errors.push("Este número do chassi já existe.");
    }

    // Verificar se o número do motor já está em uso
    const existingClientByEngineNumber = await this.vehicleModel
      .findOne({ engineNumber: updateVehicleDto.engineNumber })
      .exec();
    if (
      existingClientByEngineNumber &&
      existingClientByEngineNumber._id.toString() !== id
    ) {
      errors.push("Este número do motor já existe.");
    }

    if (errors.length > 0) {
      // Se houver mais de um erro, adicionar todas as mensagens de erro à variável de erros
      throw new HttpException({ errors: errors }, HttpStatus.BAD_REQUEST);
    }

    // Se não houver erros, então é seguro atualizar o veículo no banco de dados
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
    if (!updatedVehicle) {
      throw new NotFoundException("Veículo não encontrado.");
    }
    return { message: "Veículo atualizado com sucesso.", sucesso: true };
  }

  private async findVehicle(id: string): Promise<Vehicle> {
    try {
      return await this.vehicleModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar veículo.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getVehicle(vehicleId: string) {
    const vehicle = await this.findVehicle(vehicleId);
    if (!vehicle) {
      throw new NotFoundException("Não foi possível encontrar o veículo.");
    }
    return vehicle;
  }

  async delete(id: string) {
    try {
      const vehicle = await this.findVehicle(id);
      if (!vehicle) {
        throw new NotFoundException("Veículo não encontrado.");
      }
      await this.vehicleModel.deleteOne({ _id: id }).exec();
      return { message: "Veículo removido com sucesso.", sucesso: true };
    } catch (error) {
      throw new HttpException(
        "Falha ao remover veículo.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

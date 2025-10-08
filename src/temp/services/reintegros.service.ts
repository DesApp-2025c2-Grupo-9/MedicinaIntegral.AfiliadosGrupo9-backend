import { IReintegroRepository } from '../repositories/reintegros.repository';
import { allReintegrosDTO, ReintegrosDTO } from './dtos/reintegros.dto';

export interface IReintegroService {
  getAllReintegros: () => Promise<ReintegrosDTO[]>;
}

export default function (reintegroRepository: IReintegroRepository): IReintegroService {
  return {
    getAllReintegros: async () => {
      const reintegrosEntity = await reintegroRepository.getAllReintegros();
      return allReintegrosDTO(reintegrosEntity);
    }
  };
}

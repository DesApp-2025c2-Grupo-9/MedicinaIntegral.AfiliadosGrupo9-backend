import IReintegro from '../../interfaces/IReintegro';
import Reintegro from '../../models/Reintegro';
import ReintegroEntity from './entities/reintegros.entity';

export interface IReintegroRepository {
  getAllReintegros: () => Promise<IReintegro[]>;
}

export default function (): IReintegroRepository {
  return {
    getAllReintegros: async () => {
      const reintegrosRaw = await Reintegro.find({});
      return reintegrosRaw.map(doc => ReintegroEntity(doc));
    }
  };
}

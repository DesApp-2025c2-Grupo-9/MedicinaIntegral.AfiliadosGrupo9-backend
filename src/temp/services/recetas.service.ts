import { RecetaRepository } from "../repositories/recetas.repository";
import { CreateRecetaDTO, UpdateRecetaDTO } from "../services/dtos/receta.dto";
import { ERROR_MESSAGES } from "../../../src/utils/errorMessages";

export class RecetaService {
  private recetaRepository = new RecetaRepository();

  async getAllRecetas() {
    return await this.recetaRepository.findAll();
  }

  async getRecetaById(id: string) {
    const receta = await this.recetaRepository.findById(id);
    if (!receta) throw new Error(ERROR_MESSAGES.RECETA.NOT_FOUND);
    return receta;
  }

  async createReceta(data: CreateRecetaDTO) {
    return await this.recetaRepository.create(data);
  }

  async updateReceta(id: string, data: UpdateRecetaDTO) {
    const updated = await this.recetaRepository.update(id, data);
    if (!updated) throw new Error(ERROR_MESSAGES.RECETA.NOT_FOUND);
    return updated;
  }

  async deleteReceta(id: string) {
    const deleted = await this.recetaRepository.delete(id);
    if (!deleted) throw new Error(ERROR_MESSAGES.RECETA.NOT_FOUND);
    return deleted;
  }
}

import { IAfiliadoDocument } from '../models/Afiliado';
import { RolAfiliado } from '../enums/RolAfiliado';

export const obtenerFamiliaresPermitidos = (usuario: IAfiliadoDocument): string[] => {
  if (usuario.rol === RolAfiliado.TITULAR) {
    return usuario.grupoFamiliar.map(familiar => familiar._id.toString());
  }

 /* if (usuario.rol === RolAfiliado.CONYUGE) {
    return usuario.grupoFamiliar
      .filter(familiar => familiar.rol !== RolAfiliado.TITULAR && familiar.rol !== RolAfiliado.HIJO_MAYOR)
      .map(familiar => familiar._id.toString());
  }
*/
  return [usuario._id.toString()];
};
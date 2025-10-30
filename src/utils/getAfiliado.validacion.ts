export function validateGetAfiliadoRequest(nroDocumento: string): string[] {
  const errores: string[] = [];

  if (!nroDocumento) {
    errores.push('El número de documento es obligatorio.');
  }

  const dniRegex = /^\d{7,8}$/;
  if (!dniRegex.test(nroDocumento)) {
    errores.push('El número de documento debe tener 7 u 8 dígitos numéricos.');
  }

  return errores;
}
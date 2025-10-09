export const ERROR_MESSAGES = {
  GENERAL: {
    UNKNOWN: (error: unknown) => `Ha ocurrido un error inesperado. ${error instanceof Error && error.message}`
  },
  REINTEGRO: {
    NOT_FOUND: 'No se encontró el reintegro solicitado.'
  },
  RECETA: {
    NOT_FOUND: "Receta no encontrada",
  },
};

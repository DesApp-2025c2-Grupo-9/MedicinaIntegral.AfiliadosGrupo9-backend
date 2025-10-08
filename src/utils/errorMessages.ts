export const ERROR_MESSAGES = {
  GENERAL: {
    UNKNOWN: (error: unknown) =>
      `Ha ocurrido un error inesperado. ${
        error instanceof Error && error.message
      }`,
  },
  RECETA: {
    NOT_FOUND: "Receta no encontrada",
  },
};

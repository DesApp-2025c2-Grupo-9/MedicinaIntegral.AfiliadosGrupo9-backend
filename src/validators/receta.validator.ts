export const validarReceta = (receta: any): string[] => {
  const errores: string[] = [];

  if (!receta.nroAfiliado || !/^\d{6}-\d{2}$/.test(receta.nroAfiliado)) {
    errores.push("El número de afiliado debe tener el formato 000001-02.");
  }

  const camposObligatorios = [
    "medicamento",
    "cantidad",
    "presentacion",
    "paraAfiliado",
    "idAfiliado",
  ];
  camposObligatorios.forEach((campo) => {
    if (!receta[campo] || receta[campo].toString().trim() === "") {
      errores.push(`El campo '${campo}' es obligatorio.`);
    }
  });

  if (receta.medicamento && receta.medicamento.length < 4) {
    errores.push("El nombre del medicamento debe tener al menos 4 caracteres.");
  }

  if (
    receta.cantidad !== undefined &&
    (typeof receta.cantidad !== "number" || receta.cantidad <= 0)
  ) {
    errores.push("La cantidad debe ser un número positivo.");
  }

  if (
    receta.presentacion &&
    (receta.presentacion.length < 3 || /\d/.test(receta.presentacion))
  ) {
    errores.push(
      "La presentación debe tener al menos 3 caracteres y no contener números."
    );
  }

  const estadosValidos = [
    "pendiente",
    "aceptado",
    "rechazado",
    "observado",
    "en analisis",
  ];
  if (receta.estado && !estadosValidos.includes(receta.estado)) {
    errores.push(`El estado '${receta.estado}' no es válido.`);
  }

  if (Array.isArray(receta.observaciones)) {
    receta.observaciones.forEach((obs: any, index: number) => {
      if (!obs.rolEmisor || !obs.descripcion) {
        errores.push(`La observación #${index + 1} está incompleta.`);
      } else if (obs.fecha) {
        const fechaObs = new Date(obs.fecha);
        const fechaCreacion = receta.createdAt
          ? new Date(receta.createdAt)
          : new Date();
        if (fechaObs < fechaCreacion && obs.rolEmisor === "Prestador") {
          errores.push(
            `La fecha de la observación #${
              index + 1
            } no puede ser anterior a la creación de la receta.`
          );
        }
      }
    });
  }

  return errores;
};

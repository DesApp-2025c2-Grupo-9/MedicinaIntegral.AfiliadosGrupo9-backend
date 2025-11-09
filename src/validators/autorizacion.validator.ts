

export const validarAutorizacion = (autorizacion: any): string[] => {
  const errores: string[] = [];

  if (!autorizacion.nroAfiliado || !/^\d{6}-\d{2}$/.test(autorizacion.nroAfiliado)) {
    errores.push('El número de afiliado debe tener el formato 000001-02.');
  }

  if(!autorizacion.fechaDeSolicitud || isNaN(Date.parse(autorizacion.fechaDeSolicitud))){
    errores.push('La fecha de solicitud es inválida');
  }
  else if(new Date(autorizacion.fechaSolicitud) > new Date()) {
    errores.push("La fecha de la solicitud no puede ser futura");
  }

  const camposObligatorios = [
    'practica',
    'especialidad',
    'medicoSolicitante',
    'lugarAtencion',
    'diagnostico',
    'estado'
  ];
  camposObligatorios.forEach(campo => {
    if (!autorizacion[campo] || autorizacion[campo].toString().trim() === '') {
      errores.push(`El campo '${campo}' es obligatorio.`);
    }
  });

 
  const estadosValidos = ['pendiente', 'aprobado', 'rechazado', 'en proceso'];
  if (autorizacion.estado && !estadosValidos.includes(autorizacion.estado)) {
    errores.push(`El estado '${autorizacion.estado}' no es válido.`);
  }

  
  if (
    autorizacion.diasDeInternacion !== undefined &&
    (typeof autorizacion.diasDeInternacion !== 'number' || autorizacion.diasDeInternacion < 0)
  ) {
    errores.push('Los días de internación deben ser un número entero positivo.');
  }

  
  if (Array.isArray(autorizacion.observaciones)) {
    autorizacion.observaciones.forEach((obs: any, index: number) => {
      if (!obs.emisor || !obs.descripcion || !obs.fecha) {
        errores.push(`La observación #${index + 1} está incompleta.`);
      } else {
        const fechaObs = new Date(obs.fecha);
        const fechaSolicitud = new Date(autorizacion.fechaSolicitud);
        if (isNaN(fechaObs.getTime())) {
          errores.push(`La fecha de la observación #${index + 1} no es válida.`);
        } else if (fechaObs < fechaSolicitud) {
          errores.push(`La fecha de la observación #${index + 1} no puede ser anterior a la solicitud.`);
        }
      }
    });
  }

  return errores;
}
  


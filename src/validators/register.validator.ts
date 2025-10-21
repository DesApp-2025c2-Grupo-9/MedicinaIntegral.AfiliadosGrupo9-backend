
import  Afiliado  from '../models/Afiliado';

//esto es para el registro


//contraseña una letra mayuscula + cinco digitos
export function isValidPassword(password: string): boolean {
  const regex = /^[A-Z]\d{5}$/;
  return regex.test(password);
}

//dni solo numeros y entre 7 y 8 digitos
export function isValidDni(nroDocumento: string): boolean {
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(nroDocumento);

}

//que el usuario exista
export async function userExistsByDNI(nroDocumento: string): Promise<boolean> {
  const user = await Afiliado.findOne({ nroDocumento });
  return !!user;
}

//que el usuario no este registrado ya
export async function userExists(nroDocumento: string): Promise<boolean> {
  const user = await Afiliado.findOne({ nroDocumento });
  return !!user;
}

//chequear, validar que las contraseñas ingresadas coincidan
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}


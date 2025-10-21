
import  Afiliado  from '../models/Afiliado';


export function isValidPassword(password: string): boolean {
  const regex = /^[A-Z]\d{5}$/;
  return regex.test(password);
}


export async function userExistsByDNI(nroDocumento: string): Promise<boolean> {
  const user = await Afiliado.findOne({ nroDocumento });
  return !!user;
}

export async function userRegister(nroDocumento: string): Promise<boolean> {
  const user = await Afiliado.findOne({ nroDocumento });
  return !!user;
}

export async function validatePasswordMatch(nroDocumento: string): Promise<boolean> {
  const user = await Afiliado.findOne({ nroDocumento });
  if(!user){
    return false;
  }
  return true
  /*return user.password === user.confirmPassword;*/ //chequear esto
}
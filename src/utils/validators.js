export function required(value, fieldName = 'Campo') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new Error(`${fieldName} es obligatorio`);
  }
  return true;
}

export function isNumber(value, fieldName = 'Campo') {
  if (isNaN(value)) {
    throw new Error(`${fieldName} debe ser un número`);
  }
  return true;
}

export function minLength(value, min, fieldName = 'Campo') {
  if (value.length < min) {
    throw new Error(`${fieldName} debe tener al menos ${min} caracteres`);
  }
  return true;
}

export function isDate(value, fieldName = 'Campo') {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} debe ser una fecha válida`);
  }
  return true;
}

export function validateContract(data) {
  required(data.contrato_numero, 'Número de contrato');
  required(data.estado, 'Estado');
  
  if (data.monto_total !== undefined && data.monto_total !== null) {
    isNumber(data.monto_total, 'Monto total');
  }
  
  return true;
}

export function validateUser(data) {
  required(data.username, 'Usuario');
  required(data.role, 'Rol');
  
  if (data.password) {
    minLength(data.password, 4, 'Contraseña');
  }
  
  return true;
}

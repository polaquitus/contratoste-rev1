// ════════════════════════════════════════════════════════════════════
// VALIDATOR.JS - Framework de Validación
// ════════════════════════════════════════════════════════════════════

APP.validators = {
  
  // ─── REGLAS BASE ──────────────────────────────────────────────────
  rules: {
    required: (val, msg) => val ? null : (msg || 'Campo requerido'),
    
    minLength: (val, min, msg) => 
      val && val.length >= min ? null : (msg || `Mínimo ${min} caracteres`),
    
    maxLength: (val, max, msg) =>
      val && val.length <= max ? null : (msg || `Máximo ${max} caracteres`),
    
    number: (val, msg) =>
      !isNaN(parseFloat(val)) && isFinite(val) ? null : (msg || 'Debe ser un número'),
    
    positive: (val, msg) =>
      parseFloat(val) > 0 ? null : (msg || 'Debe ser mayor a 0'),
    
    email: (val, msg) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : (msg || 'Email inválido'),
    
    date: (val, msg) =>
      !isNaN(Date.parse(val)) ? null : (msg || 'Fecha inválida'),
    
    unique: (val, array, field, msg) =>
      !array.some(item => item[field] === val) ? null : (msg || 'Ya existe'),
    
    pattern: (val, regex, msg) =>
      regex.test(val) ? null : (msg || 'Formato inválido')
  },
  
  // ─── VALIDAR CONTRATO ─────────────────────────────────────────────
  contract: function(data) {
    const errors = [];
    
    // Número de contrato
    if (!data.num) {
      errors.push({field: 'f_num', message: 'Número de contrato requerido'});
    } else if (!/^\d{10}$/.test(data.num)) {
      errors.push({field: 'f_num', message: 'Debe tener 10 dígitos'});
    } else {
      // Verificar duplicados (excluir el actual si está editando)
      const exists = DATA.contratos.some(c => 
        c.num === data.num && c.id !== STATE.editId
      );
      if (exists) {
        errors.push({field: 'f_num', message: 'Número de contrato duplicado'});
      }
    }
    
    // Contratista
    if (!data.contratista) {
      errors.push({field: 'f_cont', message: 'Seleccioná un contratista'});
    }
    
    // Monto
    if (!data.monto) {
      errors.push({field: 'f_monto', message: 'Monto requerido'});
    } else if (isNaN(data.monto) || data.monto <= 0) {
      errors.push({field: 'f_monto', message: 'Monto inválido'});
    }
    
    // Fechas
    if (!data.fechaInicio) {
      errors.push({field: 'f_ini', message: 'Fecha inicio requerida'});
    }
    if (!data.fechaFin) {
      errors.push({field: 'f_fin', message: 'Fecha fin requerida'});
    }
    if (data.fechaInicio && data.fechaFin && data.fechaInicio >= data.fechaFin) {
      errors.push({field: 'f_fin', message: 'Fecha fin debe ser posterior a inicio'});
    }
    
    // Plazo (meses)
    if (!data.plazo || data.plazo < 1) {
      errors.push({field: 'f_plazo', message: 'Plazo inválido'});
    }
    
    // Owner
    if (!data.owner) {
      errors.push({field: 'f_owner', message: 'Owner requerido'});
    }
    
    // Asset
    if (!data.asset) {
      errors.push({field: 'f_asset', message: 'Asset requerido'});
    }
    
    return errors;
  },
  
  // ─── VALIDAR AVE ──────────────────────────────────────────────────
  ave: function(data) {
    const errors = [];
    
    if (!data.fecha) {
      errors.push({field: 'ave_fecha', message: 'Fecha requerida'});
    }
    
    if (!data.tipo) {
      errors.push({field: 'ave_tipo', message: 'Tipo requerido'});
    }
    
    if (!data.monto || isNaN(data.monto)) {
      errors.push({field: 'ave_monto', message: 'Monto inválido'});
    }
    
    return errors;
  },
  
  // ─── VALIDAR PROVEEDOR ────────────────────────────────────────────
  proveedor: function(data) {
    const errors = [];
    
    if (!data.name) {
      errors.push({field: 'prov_name', message: 'Nombre requerido'});
    }
    
    if (data.email && !this.rules.email(data.email)) {
      errors.push({field: 'prov_email', message: 'Email inválido'});
    }
    
    return errors;
  },
  
  // ─── HIGHLIGHT ERRORES ────────────────────────────────────────────
  highlightErrors: function(errors) {
    // Limpiar errores previos
    document.querySelectorAll('.err').forEach(el => el.classList.remove('err'));
    
    // Marcar campos con error
    errors.forEach(error => {
      const field = document.getElementById(error.field);
      if (field) {
        field.classList.add('err');
        
        // Agregar tooltip con mensaje
        field.title = error.message;
      }
    });
    
    // Focus en primer campo con error
    if (errors.length > 0) {
      const firstError = document.getElementById(errors[0].field);
      if (firstError) firstError.focus();
    }
  },
  
  // ─── CLEAR ERRORES ────────────────────────────────────────────────
  clearErrors: function() {
    document.querySelectorAll('.err').forEach(el => {
      el.classList.remove('err');
      el.title = '';
    });
  }
};

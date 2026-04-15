# 🚀 Deploy en GitHub Pages

## Pasos rápidos

1. **Subir a GitHub** (método web):
   - GitHub.com → New repository
   - Nombre: `contratos-ta-refactor`
   - Arrastra archivos o usa "uploading an existing file"
   - Commit changes

2. **Activar GitHub Pages**:
   - En tu repo → Settings
   - Pages (menú izquierda)
   - Source: Deploy from branch
   - Branch: main → / (root)
   - Save

3. **Esperar 1-2 minutos**

4. **Tu app estará en**: `https://TU_USUARIO.github.io/contratos-ta-refactor`

## ⚠️ Configurar variables de entorno (IMPORTANTE)

GitHub Pages no soporta variables de entorno en build-time. Tienes 2 opciones:

### Opción A: Usar valores por defecto (Ya configurado)
El archivo `src/config/env.js` ya tiene valores fallback para desarrollo.
✅ Funcionará inmediatamente en GitHub Pages

### Opción B: Usar Netlify/Vercel (Recomendado para producción)

**Netlify** (más simple):
1. https://app.netlify.com/drop
2. Arrastra carpeta completa
3. Site settings → Environment variables:
   - `VITE_SUPABASE_URL` = tu URL
   - `VITE_SUPABASE_ANON_KEY` = tu key
4. Trigger deploy

**Vercel**:
1. https://vercel.com → Import tu repo GitHub
2. Environment Variables:
   - `VITE_SUPABASE_URL` = tu URL
   - `VITE_SUPABASE_ANON_KEY` = tu key
3. Deploy

## 🔒 Seguridad

- ✅ Credenciales Supabase (anon key) son públicas por diseño
- ✅ RLS policies en Supabase protegen datos
- ⚠️ NO expongas API keys privadas (Anthropic)
- ✅ API Anthropic solo usada en features opcionales

## 🐛 Troubleshooting

**Error CORS / Failed to fetch**:
- ✅ Solucionado con servidor (GitHub Pages/Netlify)
- ❌ No abrir `index.html` directo

**Login no funciona**:
- Verifica credenciales en Supabase dashboard
- Chequea RLS policies en tabla `app_users`

**Página en blanco**:
- Abre DevTools Console (F12)
- Busca errores de módulos
- Verifica que todos los archivos se subieron

## 📱 URLs de ejemplo

- GitHub Pages: `https://usuario.github.io/contratos-ta-refactor`
- Netlify: `https://contratos-ta.netlify.app`
- Vercel: `https://contratos-ta.vercel.app`

## 📝 Checklist pre-deploy

- [ ] Todos los archivos subidos a GitHub
- [ ] `.gitignore` incluido (protege node_modules)
- [ ] GitHub Pages activado
- [ ] URL funciona
- [ ] Login funciona con credenciales de prueba

## 🆘 Ayuda

Si algo no funciona:
1. Verifica errores en Console (F12)
2. Revisa que estructura de carpetas sea correcta
3. Asegúrate GitHub Pages esté apuntando a rama `main`

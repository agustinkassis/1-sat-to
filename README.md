# 1-sat-to

**1 SAT TO** es una aplicación para visualizar en tiempo real el valor de un Satoshi en monedas de Latinoamérica, incluyendo gráficos históricos, calculadora y soporte para donaciones vía Lightning Network.

## ✅ Características

- [x] **Diseño Responsivo**: Funciona en dispositivos de escritorio y móviles
- [x] **Precio en Tiempo Real**: Muestra el valor actual de 1 SAT en múltiples monedas latinoamericanas
- [x] **Gráficos Históricos**: Visualiza tendencias de precio en diferentes períodos de tiempo
- [x] **Calculadora**: Convierte entre Satoshis y monedas fiduciarias
- [x] **Donaciones Lightning**: Soporte para pagos vía Bitcoin Lightning Network

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Gráficos**: Recharts
- **UI Components**: Shadcn
- **Pagos**: Lightning Network
- **Estilos**: Tailwind CSS
- **Fuentes**: Geist Sans

## 🏁 Primeros Pasos

### Prerrequisitos

- Node.js 18+ y pnpm
- Git

### Instalación

Este proyecto utiliza [pnpm](https://pnpm.io/) para instalar dependencias y ejecutar scripts.

1. Clona el repositorio:
```bash
git clone https://github.com/unllamas/1-sat-to.git
cd 1-sat-to
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Ejecuta el servidor de desarrollo:
```bash
pnpm dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
[1-sat-to]/
├── app/                  # Next.js App Router
│   ├── actions.ts        # Funciones del servidor para obtener precios
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/           # Componentes de React
│   ├── lightning-modal/  # Componentes para pagos Lightning
│   └── ui/               # Componentes de UI reutilizables
├── config/               # Configuraciones
├── context/              # Contextos de React
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y funciones
├── public/               # Assets estáticos
└── types/                # Definiciones de tipos TypeScript
```

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

1. Haz un fork del repositorio
2. Crea tu rama de feature (`git checkout -b feature/amazing-feature`)
3. Confirma tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 💌 Contacto

Si tienes preguntas o inquietudes sobre **1 SAT = ? PESO**, contacta al desarrollador en [Nostr](https://njump.me/npub1em3g0wcfjz5we0gaaelw07fcyqys3fwg42qykw774mvgala424rsl26ytm) o [X/Twitter](https://x.com/unllamas).

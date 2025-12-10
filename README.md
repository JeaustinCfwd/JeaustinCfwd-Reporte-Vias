# 🛣️ Sistema de Reportes de Vías

Sistema web interactivo para la gestión y visualización de reportes sobre el estado de las vías públicas. Permite a los usuarios reportar problemas en las carreteras, visualizarlos en un mapa interactivo y gestionar su seguimiento mediante un dashboard administrativo completo.

## 📊 Recursos del Proyecto

- **Diagrama de Base de Datos**: [Ver en dbdiagram.io](https://dbdiagram.io/d/FullStack-ReporteVias-690cc7fb6735e11170983774)
- **Tablero de Trello**: [Ver en Trello](https://trello.com/b/DGfEoNJR/fullstack-reportevias-cr)

## 📁 Estructura del Proyecto

El proyecto está organizado en una arquitectura monorepo separando claramente Frontend y Backend:

```
Fullstack/
├── BE/                          # Backend
│   └── sistema-reportes-backend/ # Proyecto Django REST Framework
├── FE/                          # Frontend
│   └── Reporte-Vias/            # Proyecto React + Vite
│       ├── src/
│       │   ├── components/      # Componentes Modulares
│       │   │   ├── DB*.jsx      # Componentes del Dashboard (Sidebar, Vistas, Hooks)
│       │   │   ├── PF*.jsx      # Componentes de Perfil de Usuario
│       │   │   ├── RP*.jsx      # Componentes de Reportes
│       │   │   └── ...
│       │   ├── contexts/        # Contextos (Auth, Toast, etc.)
│       │   ├── services/        # Servicios de API
│       │   └── styles/          # Estilos globales y específicos
└── README.md                    # Este archivo
```

## ✨ Características Principales

### 🎨 Experiencia de Usuario (Frontend)
- **Interfaz Moderna y Animada**: Efectos visuales con **GSAP** y renders 3D con **OGL/Three.js** (Hyperspeed, Prismas).
- **Navbar Dinámico**: Navegación receptiva con efectos de glassmorphism y menú lateral animado.
- **Gestión de Perfil Completa**:
  - Edición de datos personales.
  - Cambio de contraseña seguro.
  - Gestión de foto de perfil.
- **Sistema de Reportes**:
  - Geolocalización precisa con **Leaflet**.
  - Carga de evidencia fotográfica (Cloudinary).
  - Categorización visual y sistema de rating por estrellas.

### 📊 Dashboard Administrativo (Módulos DB*)
Un panel de control robusto y modularizado para la gestión eficiente:
- **Resumen en Tiempo Real**: Tarjetas de métricas con estilos aislados y gráficos de tendencias.
- **Mapa de Calor y Marcadores**: Visualización geográfica del estado de las vías.
- **Gestión de Datos**: Tablas interactivas con filtros avanzados (por estado, categoría, fecha, búsqueda).
- **Hooks Personalizados**: Lógica separada en hooks (`DBUseEstadisticas`, `DBUseReportes`, `DBUseFiltros`) para mayor mantenibilidad.

### 🔐 Seguridad y Backend
- **Autenticación JWT**: Tokens de acceso y refresco seguros.
- **API RESTful**: Endpoints estructurados con Django REST Framework.
- **Validaciones**: Múltiples capas de validación de datos tanto en cliente como en servidor.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Core**: React 18.2, Vite 7.1
- **Estilos**: TailwindCSS 3.4, CSS3, animaciones custom.
- **Mapas**: Leaflet 1.9, React-Leaflet 4.2.
- **Gráficos**: Chart.js 4.5, React-Chartjs-2 5.3.
- **Visuales/3D**: OGL 1.0, Three.js 0.167, GSAP 3.13.
- **Utilidades**: Lucide-React (Iconos), CLSX/Tailwind-Merge.

### Backend
- **Framework**: Django 5.x
- **API**: Django REST Framework.
- **Auth**: Simple JWT.
- **Base de Datos**: MySQL.
- **CORS**: Django CORS Headers.

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v18+ recomendado)
- Python 3.10+
- MySQL Server

### 1. Configuración del Backend

Navega al directorio del backend e instala las dependencias:

```bash
cd Fullstack/BE/sistema-reportes-backend
# Crea y activa tu entorno virtual
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

Configura las variables de entorno (`.env` en `sistema-reportes-backend/`):

```env
DB_NAME=nombre_db
DB_USER=usuario
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=tu_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

Ejecuta las migraciones y crea un superusuario:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Configuración del Frontend

Navega al directorio del frontend:

```bash
cd Fullstack/FE/Reporte-Vias
npm install
```

Crea el archivo `.env` en la raíz de `Reporte-Vias`:

```env
VITE_API_URL=http://localhost:8000/api
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

## 🎮 Comandos Disponibles (Frontend)

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build
npm run lint         # Verificar código con ESLint
```

## 👥 Contribución y Estado

El proyecto se encuentra en desarrollo activo, enfocándose en la modularización de componentes y la mejora continua de la experiencia de usuario.

---
**Desarrollado para la gestión de infraestructura vial en Costa Rica.**

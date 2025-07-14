# 🛒 Frontend - IgLu’s Shop

## 📌 Resumen

Este proyecto representa el frontend de la aplicación Full Stack desarrollada como parte del Trabajo Final de Máster. Se trata de una tienda online funcional implementada como una **SPA (Single Page Application)** usando **React**. Esta interfaz consume los endpoints ofrecidos por el backend en Laravel y permite a los usuarios navegar, registrarse, iniciar sesión, gestionar productos (según su rol), y realizar compras.

Este frontend está diseñado para funcionar con el backend desarrollado en Laravel disponible en http://127.0.0.1:8000.

---

## 📖 Descripción

La aplicación incluye funcionalidades como:

- Registro e inicio de sesión mediante tokens proporcionados por el backend (Laravel Sanctum).
- Gestión de productos por parte de administradores (crear, editar, borrar).
- Visualización de productos y compras por parte de los usuarios.
- Edición del perfil de usuario.
- Protección de rutas mediante control de roles (`admin`, `user`).
- Experiencia interactiva de usuario gracias a React Router y manejo de estado.
- Tests de extremo a extremo con Cypress.

---

## 🧰 Tecnologías utilizadas

- **Framework:** React  
- **Routing:** React Router  
- **Testing E2E:** Cypress  
- **Estilos:** CSS con metodología BEM  
- **Consumo de API:** fetch / axios  

---

## ⚙️ Configuración e instalación

### 1. Clona el repositorio

```bash
git clone <URL-del-repositorio>
cd frontend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Levantar el servidor de desarrollo (http://localhost:5173)

```bash
npm run dev
```

--- 

## ✅ Testing con Cypress

### Opciones de ejecución

1. Ejecutar pruebas directamente
   
```bash
npx cypress run
```

2. Ejecutar el entorno gráfico de Cypress
```bash
npx cypress open
```

## 🧪 Tests implementados

### 1. Admin flow
✅ Does not allow access to /admin/users as a user role
✅ Allows access to /admin/users as admin role

### 2. Proceso de compra completo con autenticación
✅ Agrega al carrito y completa la compra

### 3. Compra sin autenticación
✅ Debe redirigir al login si intenta comprar sin estar autenticado

### 4. Comprobación de subtotal, IVA y total
✅ calcula correctamente el subtotal, IVA y total

### 5. Login and Logout
✅ The user can log in with valid credentials  
✅ Displays error with invalid credentials  
✅ Allows you to log out

### 6. Access to protected routes
✅ Does not allow access to /profile without login  
✅ Allows access to /profile after login

### 7. User registration
✅ Allows you to register a new user  
✅ It does not allow you to register an existing email address.

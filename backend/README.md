# 🛒 **Backend - IgLu’s Shop**

## 📌 Resumen
Este proyecto forma parte del Trabajo Final de Máster y representa el backend de una aplicación web Full Stack para una tienda online funcional. Ha sido desarrollado utilizando **Laravel 11** como framework principal, con **MySQL** como sistema de gestión de bases de datos.

---

## 📖 Descripción

La plataforma permite:

- Registro e inicio de sesión con autenticación basada en tokens mediante **Laravel Sanctum**.
- Gestión de usuarios con roles (`admin`, `user`).
- Creación, edición y eliminación de productos.
- Realización de pedidos por parte de usuarios autenticados.
- Documentación completa de los endpoints a través de **Swagger**.
```bash
http://127.0.0.1:8000/api/documentation
```

---

## 🧰 Tecnologías

- **Framework:** Laravel 11  
- **Autenticación:** Laravel Sanctum  
- **Base de datos:** MySQL  
- **Documentación de API:** Swagger (OpenAPI)  
- **Testing:** PHPUnit  

---

## ⚙️ Configuración e instalación

### 1. Clona el repositorio

```bash
git clone <URL-del-repositorio>
cd backend
```

### 2. Crea y configura el archivo .env

```bash
cp .env.example .env
```
Edita .env con los datos de conexión de tu base de datos MySQL.

### 3. Instala las dependencias

```bash
composer install
```

### 4. Ejecuta las migraciones y seeds

```bash
php artisan migrate
php artisan db:seed
```

### 5. Crea el enlace simbólico a storage

```bash
php artisan storage:link
```

### 6. Levanta el servidor de desarrollo (http://127.0.0.1:8000)

```bash
php artisan serve
```

---

## ✅ Testing

### 1. Crea una base de datos específica para los tests.

### 2. Crea el archivo .env.testing con los parámetros del entorno de test (incluyendo la conexión a la base de datos de testing).

### 3. Ejecuta los tests

```bash
php artisan test
```

## 🧪 Tests implementados

### 1. Middleware: IsAdminMiddlewareTest

✅ test_user_with_user_token_cannot_access_admin_route

✅ test_user_with_admin_token_can_access_admin_route

✅ test_unauthenticated_user_cannot_access_admin_route

### 2. Autenticación: LoginTest

✅ test_user_can_login_with_valid_credentials

✅ test_login_fails_with_invalid_credentials

### 3. Autenticación: LogoutTest

✅ test_user_can_logout_with_valid_token

### 4. Pedidos: OrderControllerTest

✅ test_user_can_create_order

✅ test_update_stock_after_create_order

✅ test_order_fails_if_product_does_not_exist

✅ test_order_fails_if_not_enough_stock

✅ test_user_can_cancel_order

✅ test_update_stock_after_cancel_order

### 5. Outlet: OutletControllerTest

✅ test_fails_to_create_an_outlet_product_with_100_percent_discount

✅ test_fails_to_create_an_outlet_product_with_discount_greater_than_100

✅ test_fails_to_create_an_outlet_product_with_has_discount_false

### 6. Productos: ProductControllerTest

✅ test_lists_products_without_discount

✅ test_returns_422_with_has_discount_false_and_discount_greater_than_0

✅ test_sets_discount_to_zero_when_has_discount_is_false

✅ test_creates_a_product_with_invalid_data

✅ test_returns_unauthorized_when_creating_without_auth

✅ test_shows_a_product_if_not_outlet

✅ test_returns_404_for_outlet_product_on_show

✅ test_updates_a_product

✅ test_creates_a_product_with_valid_data_deletes_a_non_outlet_product

### 7. Registro de usuario: RegisterUserTest

✅ test_user_can_register_successfully

✅ test_registration_fails_with_invalid_data

✅ test_user_cannot_register_with_existing_email

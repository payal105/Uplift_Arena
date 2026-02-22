# Admin Login Credentials

## Existing Admin User

**Email:** admin@example.com  
**Password:** Check with the backend administrator

## Testing the Admin Panel

1. Make sure the backend is running:
   ```bash
   cd turf_backend
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

2. Start the admin frontend:
   ```bash
   cd turf_admin_frontend
   npm run dev
   ```
   Admin panel runs on: `http://localhost:3001`

3. Login with the admin credentials above

## API Endpoints

- **Login:** `POST /api/admin/login`
  ```json
  {
    "email": "admin@example.com",
    "password": "your_password"
  }
  ```

- **Create New Admin:** `POST /api/admin/create` (requires Super Admin token)
  ```json
  {
    "name": "Admin Name",
    "email": "admin@email.com",
    "password": "password123",
    "role": "SUPER_ADMIN" // or "SCOPED_ADMIN" or "TURF_MANAGER"
  }
  ```

## Admin Roles

- **SUPER_ADMIN:** Full access to all features
- **SCOPED_ADMIN:** Limited access to specific cities/venues/turfs
- **TURF_MANAGER:** Access to manage specific turf bookings

## Integration Status

✅ Backend API created at `/api/admin/login`  
✅ Frontend login page integrated  
✅ Token-based authentication  
✅ Protected dashboard routes  
✅ Logout functionality

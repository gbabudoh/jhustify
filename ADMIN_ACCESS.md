# Admin Panel Access Guide

## Overview

The Jhustify admin panel provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing all platform entities.

## Access Requirements

1. **User Account**: You must have a user account with the `ADMIN` role
2. **Authentication**: You must be logged in to access admin features
3. **Authorization**: All admin endpoints verify the user has `ADMIN` role

## How to Access

### 1. Main Admin Dashboard
**URL**: `/admin`

This is the central hub for all admin operations. It provides:
- Overview statistics for all entities
- Quick access to all management modules
- Platform-wide insights

### 2. Available Admin Modules

#### Users Management
**URL**: `/admin/users`
- View all platform users
- Search by name or email
- Filter by role (Admin, Trust Team, Business Owner, Consumer)
- Edit user details (name, email, role)
- Delete users (cannot delete your own account)

#### Businesses Management
**URL**: `/admin/businesses`
- View all business listings
- Search by business name, category, or email
- Filter by verification status and tier
- Update business information
- Delete businesses

#### Verifications Management
**URL**: `/admin/verifications`
- Review pending verifications
- Approve or reject verification requests
- View verification documents
- Manage verification status

#### Messages Management
**URL**: `/admin/messages`
- View all messages between consumers and businesses
- Monitor platform communication
- Filter by status (read, unread, replied)

#### Ratings Management
**URL**: `/admin/ratings`
- View all ratings and reviews
- Moderate inappropriate content
- Delete ratings if necessary

#### Subscriptions Management
**URL**: `/admin/subscriptions`
- View all active subscriptions
- Manage subscription status
- Track payment information

#### Banners Management
**URL**: `/admin/banners`
- Create promotional banners
- Manage banner positions and schedules
- Track banner performance (clicks, impressions)

#### Analytics
**URL**: `/admin/analytics`
- Platform-wide statistics
- User growth metrics
- Business verification trends
- Revenue analytics

## API Endpoints

All admin API endpoints are prefixed with `/api/admin/` and require:
- `Authorization: Bearer <token>` header
- User must have `ADMIN` role

### Available Admin API Endpoints

#### Statistics
- `GET /api/admin/stats` - Get platform statistics

#### Users
- `GET /api/admin/users` - List all users (with pagination, search, filters)
- `PATCH /api/admin/users` - Update user details
- `DELETE /api/admin/users?userId=<id>` - Delete a user

#### Businesses
- `GET /api/admin/businesses` - List all businesses (with pagination, search, filters)
- `PATCH /api/admin/businesses` - Update business details
- `DELETE /api/admin/businesses?businessId=<id>` - Delete a business

## Creating an Admin User

There are **no default admin credentials**. You must create an admin user first. Here are your options:

### Option 1: Using the Create Admin Script (Recommended)

**Using TypeScript (requires tsx):**
```bash
npm install -g tsx  # If not already installed
npm run create-admin
```

**Using JavaScript (no additional dependencies):**
```bash
npm run create-admin:js
```

The script will prompt you for:
- Admin email
- Admin password (minimum 6 characters)
- Admin name

If a user with that email already exists, it will ask if you want to update them to ADMIN role.

### Option 2: Direct Database Update

1. Connect to your MongoDB database (using MongoDB Compass, mongo shell, or any MongoDB client)
2. Find the user document you want to make admin
3. Update the `role` field to `'ADMIN'`:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "ADMIN" } }
)
```

**Note:** If you change the password, it must be hashed. Use the script above to change passwords safely.

### Option 3: Through Registration + Database Update

1. Register a new user through `/api/auth/register` (or `/register` page)
2. Connect to MongoDB and update the role:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "ADMIN" } }
)
```

### Quick Setup Example

```bash
# Run the admin creation script
npm run create-admin:js

# Enter when prompted:
# Email: admin@jhustify.com
# Password: YourSecurePassword123
# Name: Admin User

# Then login at:
# http://localhost:3000/admin/login
```

## Security Considerations

1. **Role Verification**: All admin endpoints verify the user role before allowing access
2. **Self-Protection**: Admins cannot delete their own accounts
3. **Audit Trail**: Consider adding logging for admin actions
4. **Rate Limiting**: Implement rate limiting on admin endpoints
5. **IP Whitelisting**: Consider restricting admin access to specific IP addresses in production

## Navigation

From the main admin dashboard (`/admin`), you can:
- Click on any module card to navigate to that management section
- Use the Header navigation to return to the main dashboard
- Use browser back/forward buttons

## Features

### Search and Filtering
- Most admin pages support search functionality
- Filter by various criteria (role, status, tier, etc.)
- Pagination for large datasets

### Bulk Operations
- Select multiple items for bulk actions (future enhancement)
- Export data to CSV/Excel (future enhancement)

### Real-time Updates
- Changes are reflected immediately
- No page refresh needed for most operations

## Troubleshooting

### "Access Denied" Error
- Ensure your user account has `ADMIN` role
- Check that you're logged in
- Verify your JWT token is valid

### "Unauthorized" Error
- Your session may have expired
- Log out and log back in
- Check that the token is being sent in the Authorization header

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are accessible
- Check MongoDB connection

## Best Practices

1. **Regular Backups**: Always backup data before bulk operations
2. **Test Changes**: Test changes in a development environment first
3. **Document Changes**: Keep a log of important admin actions
4. **Limit Access**: Only grant admin access to trusted users
5. **Monitor Activity**: Regularly review admin actions for suspicious activity

## Support

For admin panel issues or questions:
- Check the API documentation
- Review error messages in browser console
- Check server logs for detailed error information


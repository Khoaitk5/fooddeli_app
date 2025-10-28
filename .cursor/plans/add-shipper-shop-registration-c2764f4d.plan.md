<!-- c2764f4d-8d4b-4bba-aed1-3faf2dbc8412 c947e74d-1f04-454c-b258-7b7a4b8ba78b -->
# Add Shipper and Shop Registration Options to Customer Profile

## Changes Overview

This plan adds two registration options for customers to become Shippers or Shop Owners by creating new menu items in the profile page and implementing separate registration form pages.

## Implementation Steps

### 1. Create Shipper Registration Page

Create `client/src/pages/Customer/ShipperRegistration.jsx` with a form containing:

- Full name
- Phone number
- Email
- Vehicle type (motorcycle, bicycle, car)
- Vehicle plate number
- ID card number
- Profile photo upload
- ID card photo upload (front/back)
- Vehicle registration photo upload
- Bank account information
- Submit button that will POST to `/api/shipper/register`

### 2. Create Shop Registration Page

Create `client/src/pages/Customer/ShopRegistration.jsx` with a form containing:

- Shop name
- Shop description
- Shop address
- Phone number
- Email
- Business license number
- Business license photo upload
- Shop logo upload
- Shop cover image upload
- Bank account information
- Operating hours
- Food categories
- Submit button that will POST to `/api/shop/register`

### 3. Update Customer Profile Page

Modify `client/src/pages/Customer/UserProfile.jsx`:

- Import icons from lucide-react: `Truck` for Shipper, `Store` for Shop
- Add two new menu items to the `menuItems` array after the "Voucher & Ưu đãi" item:
- "Đăng kí trở thành Shipper" with Truck icon and orange color (#f97316)
- "Đăng kí trở thành chủ Shop" with Store icon and green color (#10b981)
- Use `navigate()` to route to the respective registration pages

### 4. Update App Routes

Modify `client/src/App.jsx`:

- Import the two new registration components
- Add routes in the Customer section:
- `/customer/register-shipper` → `<ShipperRegistration />`
- `/customer/register-shop` → `<ShopRegistration />`

## Files to Modify

- `client/src/pages/Customer/UserProfile.jsx` - Add menu items
- `client/src/App.jsx` - Add routes

## Files to Create

- `client/src/pages/Customer/ShipperRegistration.jsx` - New registration form
- `client/src/pages/Customer/ShopRegistration.jsx` - New registration form

### To-dos

- [x] Create ShipperRegistration.jsx with form fields for shipper profile information
- [x] Create ShopRegistration.jsx with form fields for shop profile information
- [ ] Add two new menu items to UserProfile.jsx for Shipper and Shop registration
- [ ] Add routes for the two registration pages in App.jsx
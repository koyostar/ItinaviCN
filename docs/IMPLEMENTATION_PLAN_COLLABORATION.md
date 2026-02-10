# Implementation Plan: Multi-User Collaboration & Expense Management

**Created**: February 10, 2026  
**Last Updated**: February 11, 2026  
**Status**: In Progress - Phase 2 (Frontend Integration)  
**Priority**: High

## 📋 Overview

Transform ItinaviCN from a single-user application to a collaborative trip planning platform with user authentication, trip sharing, and advanced expense management including receipt uploads and expense splitting.

## 🎯 Core Features

### 1. User Authentication & Management ✨
- User registration and login
- Password reset and email verification
- User profile management
- Session management with JWT tokens

### 2. Trip Collaboration 👥
- Add buddies/collaborators to trips
- Role-based permissions (Owner, Editor, Viewer)
- All buddies can edit itinerary, locations, and expenses
- Real-time updates for collaborative editing

### 3. Expense Splitting 💰
- Split expenses equally among buddies
- Custom split amounts per person
- Track who paid and who owes
- Settlement tracking and reminders

### 4. Receipt & Image Management 📸
- Upload receipt images to expenses
- Support multiple images per expense
- Image preview and download
- OCR for automatic expense amount detection (future)

## 🏗️ Technical Architecture

### Tech Stack Additions

**Backend**:
- **Authentication**: Passport.js with JWT strategy
- **File Upload**: Multer + Cloud Storage (AWS S3 / Cloudflare R2 / local storage)
- **Email**: Nodemailer for notifications
- **Real-time** (optional): Socket.io for live updates

**Frontend**:
- **Auth State**: Context API or Zustand for global auth state
- **File Upload**: React Dropzone for drag-and-drop
- **Image Preview**: react-image-lightbox or similar
- **Notifications**: Material-UI Snackbar + push notifications

**Database**:
- New tables: User, TripMember, ExpenseSplit, Receipt
- Updated tables: Trip, Expense with ownership fields

### Security Considerations

- **Password**: bcrypt hashing (salt rounds: 10)
- **JWT**: Short-lived access tokens (15min) + refresh tokens (7 days)
- **CORS**: Restricted to frontend domain
- **File Upload**: File type validation, size limits (5MB per image)
- **API**: Rate limiting with express-rate-limit
- **Authorization**: Row-level security checks

## 📊 Database Schema Changes

### New Tables

#### User
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String?
  avatar        String?  // URL to avatar image
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  ownedTrips    Trip[]   @relation("TripOwner")
  tripMembers   TripMember[]
  expenses      Expense[] @relation("ExpensePaidBy")
  expenseSplits ExpenseSplit[]
  
  @@index([email])
}
```

#### TripMember
```prisma
model TripMember {
  id        String   @id @default(cuid())
  tripId    String
  userId    String
  role      TripRole @default(EDITOR) // OWNER, EDITOR, VIEWER
  joinedAt  DateTime @default(now())
  
  trip      Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([tripId, userId])
  @@index([tripId])
  @@index([userId])
}

enum TripRole {
  OWNER
  EDITOR
  VIEWER
}
```

#### ExpenseSplit
```prisma
model ExpenseSplit {
  id         String   @id @default(cuid())
  expenseId  String
  userId     String
  amount     Decimal  @db.Decimal(10, 2)
  isPaid     Boolean  @default(false)
  paidAt     DateTime?
  
  expense    Expense  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([expenseId, userId])
  @@index([expenseId])
  @@index([userId])
}
```

#### Receipt
```prisma
model Receipt {
  id          String   @id @default(cuid())
  expenseId   String
  filename    String
  originalName String
  mimeType    String
  size        Int      // bytes
  url         String   // S3/R2 URL or local path
  uploadedAt  DateTime @default(now())
  uploadedBy  String?  // userId
  
  expense     Expense  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  
  @@index([expenseId])
}
```

### Updated Tables

#### Trip
```prisma
model Trip {
  // ... existing fields
  ownerId     String   // Add owner reference
  owner       User     @relation("TripOwner", fields: [ownerId], references: [id])
  members     TripMember[]
  isShared    Boolean  @default(false)
  
  @@index([ownerId])
}
```

#### Expense
```prisma
model Expense {
  // ... existing fields
  paidBy      String?  // userId who paid
  paidByUser  User?    @relation("ExpensePaidBy", fields: [paidBy], references: [id])
  splits      ExpenseSplit[]
  receipts    Receipt[]
  
  @@index([paidBy])
}
```

#### ItineraryItem
```prisma
model ItineraryItem {
  // ... existing fields
  createdBy   String?  // userId who created
  updatedBy   String?  // userId who last updated
  
  @@index([createdBy])
}
```

#### Location
```prisma
model Location {
  // ... existing fields
  createdBy   String?  // userId who created
  updatedBy   String?  // userId who last updated
  
  @@index([createdBy])
}
```

## 🚀 Implementation Phases

### Phase 1: User Authentication ✅ COMPLETED

**Priority**: Critical  
**Dependencies**: None  
**Status**: ✅ Phase 1 Complete (February 11, 2026)

#### Backend Tasks
- [x] Install dependencies: `passport`, `passport-jwt`, `bcrypt`, `jsonwebtoken`, `class-validator`, `class-transformer`
- [x] Create User model and migration (username-based authentication)
- [x] Implement AuthService (register, login, validateUser, token generation)
- [x] Create AuthController with endpoints (@Public decorator for auth routes)
- [x] Implement JWT strategy with Passport + ConfigService
- [x] Add authentication guards/middleware (JwtAuthGuard with global scope)
- [x] Add decorators (@CurrentUser, @Public)
- [ ] Add password reset flow with email ⏸️ Deferred
- [ ] Add refresh token rotation ⏸️ Deferred

**API Endpoints**:
```typescript
// ✅ Implemented
POST   /api/auth/register          // Register new user
POST   /api/auth/login             // Login (returns access token)
GET    /api/auth/me                // Get current user
PATCH  /api/auth/profile           // Update profile (displayName, email)
POST   /api/auth/change-password   // Change password
GET    /api/auth/users             // Get all users (dev only)
POST   /api/auth/dev-reset-password // Reset user password (dev only)

// ⏸️ Deferred
POST   /api/auth/refresh           // Refresh access token
POST   /api/auth/logout            // Invalidate refresh token
POST   /api/auth/forgot-password   // Request password reset
POST   /api/auth/reset-password    // Reset password with token
```

#### Frontend Tasks
- [x] Create auth context/provider (AuthContext with login/register/logout)
- [x] Build login page (`/login` with username/password)
- [x] Build registration page (`/register` with validation)
- [x] Implement token storage (localStorage: `itinavi_token`, `itinavi_user`)
- [x] Add auth interceptor to API client (automatic Bearer token injection)
- [x] Create ProtectedRoute component (with loading states and redirect)
- [x] Add logout functionality (Navigation menu with user dropdown)
- [x] Update Navigation component (show auth state, login/register CTAs)
- [x] Update home page (auto-redirect to trips if authenticated)
- [x] Build user profile page with edit form and password change
- [x] Add dev-only user management with password reset
- [x] Add profile menu item to navigation
- [ ] Build forgot password page ⏸️ Deferred

**Files to Create**:
```
Backend:
  apps/api/src/modules/auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── auth.service.ts
    ├── strategies/jwt.strategy.ts
    ├── guards/jwt-auth.guard.ts
    ├── decorators/current-user.decorator.ts
    └── dto/auth.dto.ts

Frontend:
  apps/web/src/contexts/AuthContext.tsx
  apps/web/src/app/auth/
    ├── login/page.tsx
    ├── register/page.tsx
    └── forgot-password/page.tsx
  apps/web/src/components/auth/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    └── ProtectedRoute.tsx
  apps/web/src/app/profile/page.tsx
```

**Completed**: February 11, 2026  
**Actual Time**: 2 days

---

### Phase 2: Trip Collaboration ⚡ MOSTLY COMPLETE (Backend Done)

**Priority**: High  
**Dependencies**: Phase 1 (Authentication) ✅  
**Status**: Backend ✅ | Frontend 🚧 In Progress

#### Backend Tasks
- [x] Create TripMember model and migration (with TripRole: OWNER/EDITOR/VIEWER)
- [x] Add ownerId to Trip model (foreign key to User)
- [x] Implement trip member management in TripsService (add, remove, update role)
- [x] Add authorization checks to all trip endpoints (requireTripAccess, requireTripEditAccess, requireTripOwnership)
- [x] Add member management endpoints (list, add, update, remove)
- [x] Create DTOs for member operations (AddTripMemberDto, UpdateTripMemberDto)
- [ ] Send email invitations to buddies ⏸️ Deferred
- [ ] Add activity log for collaborative changes ⏸️ Optional
- [ ] Send email invitations to buddies
- [ ] Add activity log for collaborative changes (optional)
 ✅ Implemented
POST   /api/trips/:tripId/members        // Add member to trip
GET    /api/trips/:tripId/members        // List all members
PATCH  /api/trips/:tripId/members/:userId // Update member role
DELETE /api/trips/:tripId/members/:userId // Remove member

// Email Invitations ⏸️ Deferred
POST   /api/trips/:tripId/invite         // Send email invitation

// Updated Authorization ✅ Implemented
// All trip, location, itinerary, expense endpoints check:
// - User is owner OR member with appropriate role
// - OWNER: full control, EDITOR: can modify, VIEWER: read-only

// Updated Authorization
// All existing trip endpoints check user is owner or member with appropriate role
```

#### Frontend Tasks
- [ ] Add "Share Trip" button to trip page
- [ ] Build member management dialog
- [ ] Add member invitation form (email input)
- [ ] Display member list with role badges
- [ ] Add role change dropdown (owner only)
- [ ] Add remove member button (owner only)
- [ ] Show collaborator avatars on trip card
- [ ] Add "Shared with X people" indicator
- [ ] Update all forms to show created/updated by info

**Authorization Logic**:
```typescript
// Example: Who can do what?
- OWNER: Full control (delete trip, manage members, all edits)
- EDITOR: Add/edit/delete itinerary, locations, expenses
- VIEWER: View only, no modifications
```

**Files to Create**:
```
Backend:
  apps/api/src/modules/trip-members/
    ├── trip-member.module.ts
    ├── trip-member.service.ts
    ├── trip-member.controller.ts
    └── guards/trip-authorization.guard.ts

Frontend:
  Backend Completed**: February 11, 2026  
**Frontend Status**: 🚧 Pending

---

### Phase 3: Expense Splitting ✅ BACKEND COMPLETE

**Priority**: High  
**Dependencies**: Phase 2 (Trip Collaboration) ✅  
**Status**: Backend ✅ | Frontend ⏸️ Not Started

#### Backend Tasks
- [x] Create ExpenseSplit model and migration (amountOwed, isSettled, settledAt)
- [x] Update Expense model with paidByUserId and paymentMethod (Cash/Card/App enum)
- [x] Implement expense split methods in ExpensesService
- [x] Add auto-split and custom split support
- [x] Add settlement calculation endpoints (getUserBalanceSummary, getTripBalances)
- [x] Settlement tracking (settleExpenseSplit method)
- [x] Update expense responses to include split detail
#### Backend Tasks
- [ ] Create ExpenseSplit model and migration
- [ ] Update Expense model with paidBy field
- [ ] Implement ExpenseSpli ✅ Implemented
POST   /api/trips/:tripId/expenses/:expenseId/settle/:userId // Settle a specific split
GET    /api/trips/:tripId/balances                           // Get trip-wide balance summary
GET    /api/trips/:tripId/my-balance                         // Get current user's balance

// Split creation is handled in expense create/update
// ExpenseSplit records are created automatically on expense creatione splits
GET    /api/trips/:tripId/expenses/:expenseId/splits  // Get expense splits
DELETE /api/trips/:tripId/expenses/:expenseId/splits/:userId // Remove split
POST   /api/trips/:tripId/expenses/:expenseId/auto-split // Auto split equally

// Settlement
GET    /api/trips/:tripId/settlements    // Get who owes whom
POST   /api/trips/:tripId/settle          // Mark settlements as paid
```

#### Frontend Tasks
- [ ] Update expense form to include "Paid by" dropdown
- [ ] Add expense split section to form
- [ ] Build split calculator (equal/custom/percentage)
- [ ] Show split breakdown on expense card
- [ ] Create settlement summary page
- [ ] Build "Who owes whom" visualization
- [ ] Add "Mark as settled" functionality
- [ ] Add split expense badge/indicator

**Split Calculation Examples**:
```typescript
// Example: Dinner for 3 people, total 300 CNY
// Equal split:
Person A (paid): 300 CNY → owes 0, receives 200
Person B: owes 100
Person C: owes 100

// Custom split:
Person A (paid): 300 CNY → owes 0, receives 220
Person B: owes 120 (had dessert)
Person C: owes 80 (just main)
```

**Files to Create**:
```
Backend:
  apps/api/src/modules/expense-splits/
    ├── expense-split.service.ts
    └── dto/split.dto.ts

Frontend:
  apps/web/src/components/expenses/
    ├── ExpenseSplitForm.tsx
    ├── SplitCalculator.tsx
    ├── SettlementSummary.tsx
    └── SettlementCard.tsx
  apps/web/src/app/trips/[tripId]/settlements/
    └── page.tsx
```
Backend Completed**: February 11, 2026 (schema only)  
**Frontend Status**: ⏸️ Not Started

---

### Phase 4: Receipt Image Upload 🚧 SCHEMA READY

**Priority**: Medium  
**Dependencies**: Phase 1 (Authentication) ✅  
**Status**: Schema ✅ | Implementation ⏸️ Pending

#### Backend Tasks
- [x] Create ExpenseImage model in schema (supports Receipt/Item/Other types)
- [x] Schema supports multiple images per expense with metadata
- [ ] Install dependencies: `multer`, `@aws-sdk/client-s3` (or local storage) ⏸️
- [ ] Implement FileUploadService (upload, delete, get URL) ⏸️
- [ ] Add image upload endpoint with file validation ⏸️
- [ ] Configure storage (S3/R2 or local uploads folder) ⏸️
- [ ] Add image compression/optimization (optional) ⏸️
- [ ] Implement delete image endpoint ⏸️n (optional)
- [ ] Implement delete receipt endpoint

**Storage Options**:
1. **AWS S3** (production recommended)
   - Pros: Scalable, reliable, CDN integration
   - Cons: Costs money
   
2. **Cloudflare R2** (cost-effective alternative)
   - Pros: S3-compatible, free egress, cheaper
   - Cons: Newer service
   
3. **Local Storage** (development/small deployments)
   - Pros: Free, simple
   - Cons: Not scalable, no CDN

**API Endpoints**:
```typescript
POST   /api/trips/:tripId/expenses/:expenseId/receipts      // Upload receipt
GET    /api/trips/:tripId/expenses/:expenseId/receipts      // List receipts
DELETE /api/trips/:tripId/expenses/:expenseId/receipts/:id  // Delete receipt
GET    /api/receipts/:id/download                          // Download receipt
```

#### Frontend Tasks
- [ ] Install react-dropzone
- [ ] Build receipt upload component with drag-and-drop
- [ ] Add image preview in expense form
- [ ] Display receipt thumbnails on expense cards
- [ ] Build receipt lightbox/gallery view
- [ ] Add delete receipt button
- [ ] Show upload progress indicator
- [ ] Add file size and type validation
- [ ] Support multiple image uploads

**File Upload Constraints**:
```typescript
- Max file size: 5MB per image
- Allowed formats: JPEG, PNG, PDF
- Max receipts per expense: 10
- File naming: {expenseId}_{timestamp}_{random}.{ext}
```

**Files to Create**:
```
Backend:
  apps/api/src/modules/receipts/
    ├── receipt.module.ts
    ├── receipt.controller.ts
    ├── receipt.service.ts
    └── upload.config.ts

Frontend:
  apps/web/src/components/expenses/
    ├── ReceiptUpload.tsx
    ├── ReceiptGallery.tsx
  Status**: Schema ready, implementation pending

---

## ✅ Additional Completed Features

### Shared Schema Package ✅
**Completed**: February 11, 2026

- [x] Created @itinavi/schema package as single source of truth
- [x] Auth schemas with Zod validation (RegisterRequest, LoginRequest, UpdateProfile, etc.)
- [x] Location constants (COUNTRIES, CITIES) with bilingual support (English/Chinese)
- [x] Timezone constants (COMMON_TIMEZONES, COUNTRY_TIMEZONES) and helper functions
- [x] Trip collaboration schemas (TripRole, AddTripMemberRequest, UpdateTripMemberRequest)
- [x] ExchangeRateApiResponse interface for external API integration
- [x] Migrated all API DTOs to use Zod schemas
- [x] Migrated all frontend types to use shared schemas
- [x] Deleted duplicate code (locations.ts, timezone.ts utilities)

### User Profile Management ✅
**Completed**: February 11, 2026

- [x] Full profile editing page (displayName, email)
- [x] Password change functionality with validation
- [x] Dev-only user management table
- [x] Password reset for any user (dev admin feature)
- [x] Profile menu item in navigation
- [x] API endpoints: updateProfile, changePassword, getAllUsers, devResetPassword

### API Testing Infrastructure ✅
**Completed**: February 11, 2026

- [x] Comprehensive api.rest file with all endpoints
- [x] Auto-extract JWT token from login response (`{{login.response.body.accessToken}}`)
- [x] China-themed sample data (Sichuan cities: Chengdu, Leshan, Emeishan)
- [x] Complete test cases for trips, locations, itinerary, expenses, auth
- [x] Added profile and password test endpoints
- [x] Ready-to-use REST client for development testing

### Payment Method Tracking ✅
**Completed**: February 11, 2026

- [x] PaymentMethod enum in schema (Cash/Card/App)
- [x] Track payment method on each expense
- [x] Support for different payment types common in China

### Schema Enhancements ✅
**Completed**: February 11, 2026

- [x] UserType enum (Dev/User) for user categorization
- [x] ExpenseImageType enum (Receipt/Item/Other)
- [x] Timezone support in ItineraryItem
- [x] Geographic fields for AMap integration (amapId, province, city, district)
    └── ReceiptLightbox.tsx
```

**Estimated Time**: 4-6 days

---

## 🎨 Additional Features (Lower Priority)

### 5. Real-time Collaboration (Optional, 7-10 days)

**Why**: See changes from other users live without refreshing

**Implementation**:
- Install Socket.io on backend and frontend
- Emit events on create/update/delete operations
- Listen for events and update UI in real-time
- Show "User X is editing..." indicators
- Optimistic UI updates

**Events**:
```typescript
// Socket events
'itinerary:created'
'itinerary:updated'
'itinerary:deleted'
'location:created'
'expense:created'
'member:joined'
```

### 6. Notifications & Activity Feed (5-7 days)

**Why**: Keep users informed of trip changes

**Features**:
- In-app notification center
- Email notifications for important events
- Activity feed on trip dashboard
- Notification preferences per user

**Events to Notify**:
- New member added to trip
- Expense added/split created
- Itinerary item changed
- Someone settled their expenses

### 7. Mobile App (30-60 days)

**Why**: Better mobile experience, offline access

**Technology**: React Native or Expo

**Features**:
- Same features as web app
- Camera integration for receipts
- Offline mode with sync
- Push notifications
- Location tracking for auto-check-in

### 8. Advanced Expense Features (7-10 days)

**Features**:
- OCR for receipt scanning (Tesseract.js or cloud OCR)
- Multi-currency expense tracking per item
- Budget alerts and tracking
- Expense categories with icons
- Export expenses to Excel/CSV
- Expense approval workflow (optional)
Timeline & Progress

### ✅ Completed (February 10-11, 2026)
1. **Phase 1**: User Authentication (Backend + Frontend) - 2 days
   - ✅ Auth system with JWT tokens
   - ✅ Login/register pages with full validation
   - ✅ User profile management with password change
   - ✅ Dev admin features (user management, password reset)
2. **Phase 2**: Trip Collaboration (Backend) - 1 day
   - ✅ Complete backend API with role-based access
   - ✅ Authorization guards on all endpoints
3. **Phase 3**: Expense Splitting (Backend) - 1 day
   - ✅ Schema and API for expense splits
   - ✅ Settlement calculation endpoints
4. **Shared Schema Package**: Single source of truth - 1 day
   - ✅ Migrated all DTOs to Zod schemas
   - ✅ Consolidated constants (locations, timezones)
   - ✅ Eliminated code duplication
5. **API Testing**: Comprehensive test infrastructure - 1 day  
   **Milestone Achieved**: ✅ Full auth system, backend collaboration ready, shared schema established

### 🚧 In Progress (Week of February 11, 2026)
1. **Phase 2 Frontend**: Trip member management UI
   - Share trip dialog
   - Member list with roles
   - Add/remove members interface
2. **Phase 3 Frontend**: Expense split UI
   - Split calculator
   - Settlement summary
   - Balance tracking display

### 📋 Immediate Next Steps (Weeks 2-3)
3. **Trip Detail Pages**: Complete CRUD UI for locations, itinerary, expenses
4. **Phase 4**: Receipt image upload implementation
5. **Testing & Polish**: E2E testing, responsive design  
   **Target Milestone**: Full collaborative trip planning with expense management

### 🎯 Short-term (Month 2)
6. Email notifications for trip invitations
7. Activity feed for trip changes
8. Mobile responsiveness optimization
9. Performance optimization & caching  
   **Target Milestone**: Production-ready MVP

### 🚀 Medium-term (Months 3-4)
10. Advanced expense features (OCR, budgets)
11. Trip templates and cloning
12. Public trip sharing
13. Real-time collaboration (Socket.io)  
    **Target Milestone**: Feature-complete collaborative platform

### 🌟 Long-term (Months 5-6+)
14. Mobile App (React Native)
15. AI-Powered Features (itinerary suggestions)
16. Social Features (reviews, ratings, photo gallery)
17. Multi-language support expansion
- AI itinerary suggestions based on destination
- Budget recommendations
- Weather-aware packing lists
- Optimal route planning
- Translation integration

## 📅 Recommended Timeline

### Immediate Priority (Weeks 1-4)
1. **Week 1-2**: Phase 1 - User Authentication
2. **Week 3-4**: Phase 2 - Trip Collaboration  
   **Milestone**: Users can invite buddies and collaborate

### Short-term (Weeks 5-8)
3. **Week 5-6**: Phase 3 - Expense Splitting
4. **Week 7-8**: Phase 4 - Receipt Upload  
   **Milestone**: Full expense management with splitting

### Medium-term (Months 3-4)
5. Notifications & Activity Feed
6. Advanced Expense Features (OCR)
7. Mobile responsiveness polish  
   **Milestone**: Production-ready collaborative app

### Long-term (Months 5-6+)
8. Real-time Collaboration
9. Mobile App (React Native)
10. AI-Powered Features
11. Social Features

## 🔧 Development Setup Changes

### Environment Variables (.env)

```bash
# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (for invitations and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_STORAGE=local  # or 's3' or 'r2'
UPLOAD_MAX_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads  # for local storage

# AWS S3 (if using S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=itinavi-receipts

# Cloudflare R2 (if using R2)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=itinavi-receipts

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Package Dependencies

**Backend** (`apps/api/package.json`):
```json
{
  "dependencies": {
    "@nestjs/passport": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "bcrypt": "^5.1.0",
    "@types/bcrypt": "^5.0.0",
### Phase 1-2 Success Criteria
- [x] Users can register and login ✅
- [x] Authentication persists across page refreshes ✅
- [x] Protected routes redirect to login ✅
- [x] Users can edit their profile and change password ✅
- [x] Dev users can manage all users ✅
- [x] Backend authorization checks all trip access ✅
- [x] Shared schema package eliminates type duplication ✅
- [ ] Users can invite buddies via UI 🚧 Backend ready
- [ ] Multiple users can edit same trip 🚧 Backend ready
- [ ] Changes are visible to all members 🚧 Frontend pending

### Phase 3-4 Success Criteria
- [x] Expense split schema supports multiple users ✅
- [x] Settlement calculations are accurate ✅
- [x] Balance tracking endpoints working ✅
- [ ] Expenses can be split via UI ⏸️ Frontend pending
- [ ] Settlement summary displays correctly ⏸️ Frontend pending
- [ ] Receipts can be uploaded ⏸️ Not implemented
- [ ] Image uploads work reliably ⏸️ Not implemented

### Current Technical Metrics
- [x] API build passes without errors ✅
- [x] All auth endpoints tested and working ✅
- [x] Profile management fully functional ✅
- [x] JWT token validation functional ✅
- [x] Database schema migration successful ✅
- [x] Frontend authentication flow complete ✅
- [x] Shared schema package established ✅
- [x] Zero code duplication for types and constants ✅

### Target Overall Metrics (Post-Launch)
- User retention rate > 60% after 1 month
- Average trip has 2+ collaborators
- 80%+ of expenses include receipt images
- Load time < 2 seconds for all pages
- 95%+ API success rate
    "socket.io-client": "^4.6.0", // optional for real-time
    "zustand": "^4.4.0" // optional, alternative to Context API
  }
}
```

### Schema Package Updates
Immediate Next Steps (February 11, 2026)

### Priority 1: Complete Phase 2 Frontend
1. **Build trip member management UI**
   - [ ] ShareTripDialog component
   - [ ] MemberList with role badges
   - [ ] Add/remove member functionality
   - [ ] Role update dropdown (owner only)

### Priority 2: Build Trip Detail Pages
2. **Create comprehensive trip detail UI**
   - [ ] Trip overview page with tabs
   - [ ] Location management (list, add, edit, delete)
   - [ ] Itinerary builder (timeline view)
   - [ ] Expense tracker with splits

### Priority 3: Complete Phase 3 Frontend
3. **Implement expense split UI**
   - [ ] Expense form with split calculator
   - [ ] Settlement summary page
   - [ ] Balance display (who owes whom)
   - [ ] Mark as settled functionality

### Priority 4: Testing & Polish
4. **Ensure quality and usability**
   - [ ] Test full user journey (register → create trip → invite → add expense)
   - [ ] Responsive design for mobile
   - [ ] Error handling and loading states
   - [ ] Performance optimization

### Priority 5: Phase 4 Implementation
5. **Add receipt upload feature**
   - [ ] Install multer and configure storage
   - [ ] Implement upload endpoints
   - [ ] Build frontend upload component
   - [ ] Image gallery view

---

## 📝 Development Notes

### Key Implementation Decisions Made
1. **Username-based auth** instead of email-only (more flexible for China users)
2. **ConfigService for JWT** to properly load environment variables
3. **PaymentMethod enum** supports Cash/Card/App (local payment methods)
4. **ExpenseImage** instead of Receipt (supports multiple image types)
5. **localStorage** for token storage (simple, works for SPA)
6. **Shared @itinavi/schema package** for single source of truth (eliminates duplication)
7. **Zod validation** instead of class-validator (better type inference, smaller bundle)
8. **Dev user type** for admin features (user management, password reset)

### Technical Debt Identified
- [ ] Email notifications not implemented (deferred)
- [ ] Refresh token rotation not implemented (deferred)
- [ ] Password reset flow not implemented (deferred)
- [ ] Real-time updates not implemented (optional)

### Performance Considerations
- All endpoints use proper indexing (userId, tripId, etc.)
- Authorization checks happen early in request lifecycle
- JWT tokens properly cached in browser localStorage

---

**Last Updated**: February 11, 2026 (Evening)  
**Next Review**: After Phase 2 Frontend completion

---

## 📦 Recent Commits (February 11, 2026)

### Architecture Improvements
1. **feat(schema)**: Create shared schema package with auth, constants, and types
   - Established @itinavi/schema as single source of truth
   - Added auth schemas, location/timezone constants, trip collaboration types
   - 17 files changed, 975 insertions

2. **refactor(api)**: Migrate to shared schema with Zod validation
   - Replaced class-validator DTOs with Zod schemas
   - Added profile management and dev admin endpoints
   - 8 files changed, 218 insertions, 77 deletions

3. **refactor(web)**: Migrate to shared schema package
   - Updated all imports to use @itinavi/schema
   - Eliminated duplicate location and timezone utilities
   - 19 files changed, 29 insertions, 238 deletions

4. **feat(web)**: Add user profile management page
   - Built complete profile editing interface
   - Added password change functionality
   - Implemented dev admin user management
   - 3 files changed, 393 insertions
- Auth service: registration, login, token validation
- Authorization guards: role checks
- Expense split calculations
- File upload validation

### Integration Tests
- End-to-end auth flow
- Trip member invitation and acceptance
- Expense creation with splits
- Receipt upload and retrieval

### E2E Tests
- User registration → create trip → invite buddy → add expense → split
- Receipt upload and deletion

## 📊 Success Metrics

### Phase 1-2 Success Criteria
- [ ] Users can register and login
- [ ] Users can invite buddies via email
- [ ] Multiple users can edit same trip
- [ ] Changes are immediately visible to all members

### Phase 3-4 Success Criteria
- [ ] Expenses can be split among members
- [ ] Settlement calculations are accurate
- [ ] Receipts can be uploaded and viewed
- [ ] Image uploads work reliably

### Overall Success Metrics
- User retention rate > 60% after 1 month
- Average trip has 2+ collaborators
- 80%+ of expenses include receipt images
- Load time < 2 seconds for all pages

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex auth implementation | High | Use well-tested libraries (Passport.js), follow security best practices |
| File storage costs | Medium | Start with local storage, migrate to R2 (cheaper than S3) |
| Concurrent editing conflicts | Medium | Implement optimistic locking or real-time sync |
| Email delivery issues | Low | Use reliable SMTP service (SendGrid, AWS SES) |
| Performance with many members | Medium | Add pagination, implement caching |

## 📚 Resources & References

- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Multer Documentation](https://github.com/expressjs/multer)
- [AWS S3 SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)
- [React Dropzone](https://react-dropzone.js.org/)
- [Socket.io Documentation](https://socket.io/docs/v4/)

## 🎯 Next Steps

1. **Review this plan** with team/stakeholders
2. **Prioritize phases** based on business needs
3. **Set up development timeline** and assign tasks
4. **Create GitHub issues** for each major task
5. **Begin Phase 1** implementation

---

**Questions or feedback?** Update this document as the project evolves.

# Loan Assessment Portal - Frontend Implementation Plan

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **React Hook Form + Zod** for form validation
- **TanStack Query** for data fetching
- **React Router DOM** for routing
- **Vitest + React Testing Library** for testing

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn components (existing)
│   ├── layout/          # Layout components
│   ├── forms/           # Form-specific components
│   ├── charts/          # Data visualization
│   └── loan/            # Loan-specific components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and configurations
├── services/            # API services
├── types/               # Type definitions
├── utils/               # Helper functions
├── stores/              # State management
└── __tests__/           # Test files
```

## Page-by-Page Implementation Plan

### 1. Authentication Pages

**Pages:** `/login`, `/register`, `/forgot-password`

**Components:**

- `pages/auth/LoginPage.tsx`
- `pages/auth/RegisterPage.tsx`
- `pages/auth/ForgotPasswordPage.tsx`
- `components/forms/LoginForm.tsx`
- `components/forms/RegisterForm.tsx`
- `components/layout/AuthLayout.tsx`

**Types:**

- `types/auth.ts` - User, LoginCredentials, RegisterData

**Services:**

- `services/authService.ts` - login, register, forgotPassword APIs

**Utils:**

- `utils/validation.ts` - Auth form validation schemas

### 2. Dashboard/Overview Page

**Page:** `/dashboard`

**Components:**

- `pages/dashboard/DashboardPage.tsx`
- `components/layout/DashboardLayout.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Header.tsx`
- `components/charts/LoanStatusChart.tsx`
- `components/charts/ApplicationMetrics.tsx`
- `components/loan/RecentApplications.tsx`
- `components/loan/QuickActions.tsx`

**Types:**

- `types/dashboard.ts` - DashboardStats, MetricsData

**Services:**

- `services/dashboardService.ts` - getDashboardStats, getRecentApplications

### 3. Loan Application Form Pages

**Pages:** `/apply`, `/apply/personal`, `/apply/financial`, `/apply/documents`, `/apply/review`

**Components:**

- `pages/loan/LoanApplicationPage.tsx`
- `pages/loan/PersonalInfoPage.tsx`
- `pages/loan/FinancialInfoPage.tsx`
- `pages/loan/DocumentUploadPage.tsx`
- `pages/loan/ApplicationReviewPage.tsx`
- `components/forms/PersonalInfoForm.tsx`
- `components/forms/FinancialInfoForm.tsx`
- `components/forms/DocumentUploadForm.tsx`
- `components/loan/ApplicationStepper.tsx`
- `components/loan/DocumentViewer.tsx`
- `components/loan/ApplicationSummary.tsx`

**Types:**

- `types/loan.ts` - LoanApplication, PersonalInfo, FinancialInfo, Document
- `types/enums.ts` - LoanType, ApplicationStatus, DocumentType

**Services:**

- `services/loanService.ts` - submitApplication, uploadDocument, getLoanTypes
- `services/fileService.ts` - uploadFile, downloadFile

**Utils:**

- `utils/loanValidation.ts` - Multi-step form validation schemas
- `utils/fileUtils.ts` - File upload helpers

### 4. Application Management Pages

**Pages:** `/applications`, `/applications/:id`, `/applications/:id/edit`

**Components:**

- `pages/applications/ApplicationsListPage.tsx`
- `pages/applications/ApplicationDetailPage.tsx`
- `pages/applications/ApplicationEditPage.tsx`
- `components/loan/ApplicationsTable.tsx`
- `components/loan/ApplicationCard.tsx`
- `components/loan/ApplicationTimeline.tsx`
- `components/loan/StatusBadge.tsx`
- `components/forms/ApplicationEditForm.tsx`

**Types:**

- `types/application.ts` - ApplicationSummary, ApplicationDetail, StatusHistory

**Services:**

- `services/applicationService.ts` - getApplications, getApplication, updateApplication

### 5. Assessment & Review Pages

**Pages:** `/assessments`, `/assessments/:id`

**Components:**

- `pages/assessments/AssessmentsPage.tsx`
- `pages/assessments/AssessmentDetailPage.tsx`
- `components/loan/AssessmentTable.tsx`
- `components/loan/RiskAnalysis.tsx`
- `components/loan/CreditScore.tsx`
- `components/loan/AssessmentActions.tsx`
- `components/charts/RiskMetrics.tsx`

**Types:**

- `types/assessment.ts` - Assessment, RiskAnalysis, CreditInfo

**Services:**

- `services/assessmentService.ts` - getAssessments, approveApplication, rejectApplication

### 6. Reports & Analytics Pages

**Pages:** `/reports`, `/reports/analytics`

**Components:**

- `pages/reports/ReportsPage.tsx`
- `pages/reports/AnalyticsPage.tsx`
- `components/charts/LoanTrends.tsx`
- `components/charts/ApprovalRates.tsx`
- `components/charts/RiskDistribution.tsx`
- `components/reports/ReportFilters.tsx`
- `components/reports/ExportButton.tsx`

**Types:**

- `types/reports.ts` - ReportData, ChartData, FilterOptions

**Services:**

- `services/reportService.ts` - getReports, exportReport

### 7. Settings & Profile Pages

**Pages:** `/profile`, `/settings`

**Components:**

- `pages/profile/ProfilePage.tsx`
- `pages/settings/SettingsPage.tsx`
- `components/forms/ProfileForm.tsx`
- `components/forms/SettingsForm.tsx`

**Types:**

- `types/profile.ts` - UserProfile, UserSettings

**Services:**

- `services/profileService.ts` - getProfile, updateProfile

## Common Components & Utils

### Layout Components

- `components/layout/AppLayout.tsx` - Main app wrapper
- `components/layout/PageHeader.tsx` - Page title and actions
- `components/layout/LoadingSpinner.tsx`
- `components/layout/ErrorBoundary.tsx`

### Common UI Components

- `components/ui/DataTable.tsx` - Enhanced table component
- `components/ui/DateRangePicker.tsx`
- `components/ui/FileUpload.tsx`
- `components/ui/StatusIndicator.tsx`

### Hooks

- `hooks/useAuth.ts` - Authentication state
- `hooks/useLoanApplication.ts` - Multi-step form state
- `hooks/useDebounce.ts` - Debounced search
- `hooks/useLocalStorage.ts` - Local storage management

### Utils

- `utils/api.ts` - API client configuration
- `utils/formatters.ts` - Number, date, currency formatting
- `utils/constants.ts` - App constants
- `utils/permissions.ts` - Role-based access control

### Services

- `services/api.ts` - Base API service
- `services/errorHandler.ts` - Global error handling

## API Integration

### Endpoints Structure

- `/auth/*` - Authentication endpoints
- `/loans/*` - Loan application management
- `/assessments/*` - Risk assessment and approval
- `/reports/*` - Analytics and reporting
- `/users/*` - User management

## Testing Strategy

### Test Organization

```
src/
├── __tests__/
│   ├── components/      # Component tests
│   ├── pages/           # Page tests
│   ├── hooks/           # Custom hook tests
│   ├── services/        # API service tests
│   ├── utils/           # Utility function tests
│   └── __mocks__/       # Mock data and services
├── setupTests.ts        # Test configuration
└── test-utils.tsx       # Testing utilities
```

### Testing Tools & Setup

- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking
- **@testing-library/user-event** - User interaction testing

### Test Files Organization

- `Component.test.tsx` for component tests
- `service.test.ts` for service tests
- `utils.test.ts` for utility tests
- `Page.integration.test.tsx` for page integration tests

### Key Test Utilities

- `src/test-utils.tsx` - Custom render function with providers
- `src/setupTests.ts` - Global test configuration
- `src/__mocks__/handlers.ts` - MSW request handlers
- `src/__mocks__/data.ts` - Mock data generators

### Testing Patterns

#### Component Testing

```typescript
// Example: components/forms/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('submits form with valid credentials', async () => {
    // Test implementation
});
```

#### Page Testing

```typescript
// Example: pages/dashboard/DashboardPage.test.tsx
import { renderWithProviders } from '../../test-utils';
import { DashboardPage } from './DashboardPage';

test('displays dashboard metrics on load', async () => {
    // Integration test implementation
});
```

#### Service Testing

```typescript
// Example: services/loanService.test.ts
import { server } from '../__mocks__/server';
import { loanService } from './loanService';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Hook Testing

```typescript
// Example: hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

test('manages authentication state correctly', () => {
    // Hook test implementation
});
```

### Test Coverage Areas

#### Critical Test Cases

1. **Authentication Flow**
    - Login/logout functionality
    - Token refresh handling
    - Protected route access

2. **Form Validation**
    - Required field validation
    - Format validation (email, phone, etc.)
    - Multi-step form navigation

3. **State Management**
    - Application state transitions
    - Data persistence
    - Error state handling

4. **API Integration**
    - Successful data fetching
    - Error handling and retry logic
    - Loading states

5. **User Interactions**
    - Form submissions
    - Navigation between pages
    - File upload functionality

#### MSW Mock Handlers

```typescript
// src/__mocks__/handlers.ts
export const handlers = [
    rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({ token: 'mock-token' }));
    }),
    rest.get('/api/loans/applications', (req, res, ctx) => {
        return res(ctx.json(mockApplications));
    })
    // Additional handlers...
];
```

#### Test Commands

- `npm run test` - Run all tests
- `npm run test:ui` - Interactive test UI
- `npm run test:coverage` - Generate coverage report
- `npm run test:ci` - CI-friendly test run

## Implementation Phases

### Phase 1: Core Setup & Authentication

- Project structure setup
- Authentication pages and services
- Basic routing and layout

### Phase 2: Dashboard & Navigation

- Dashboard implementation
- Sidebar and navigation
- Basic data visualization

### Phase 3: Loan Application Flow

- Multi-step application form
- Document upload functionality
- Application submission

### Phase 4: Application Management

- Applications listing and filtering
- Application details and editing
- Status management

### Phase 5: Assessment & Analytics

- Assessment dashboard
- Risk analysis components
- Reports and charts

### Phase 6: Testing & Polish

- Comprehensive test coverage
- Performance optimization
- UI/UX refinements

# Environment Configuration

## API Base URL

The application uses a global API base URL configured in `src/api/client.js`.
Current behavior:

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "";
```

- If `VITE_API_BASE_URL` is set, that absolute host is used.
- If not set, requests are same-origin (`/api/...`) and Vite proxy forwards to backend in local dev.

### Setting the Base URL

**Option 1: Local Dev (Recommended)**

Leave `.env` without `VITE_API_BASE_URL` so both PC and mobile use the same frontend origin and Vite proxy:

```env
# keep empty for local dev
```

**Option 2: Environment Variable (Use only when needed)**

Create a `.env` file in the `Main/` directory:

```env
VITE_API_BASE_URL=http://YOUR_API_HOST:3001
```

## Updated Components

All hooks and API functions have been updated to use the global API client and base URL:

### Hooks Using API Client

- `src/hooks/loans.details.page/recordPayment.js`
- `src/hooks/loans.details.page/useGetLoanProfileInfo.js`
- `src/hooks/loans.details.page/useGetLoanSchedule.js`
- `src/hooks/loans.management.page.hooks/useGetClientsLoansList.js`
- `src/hooks/loans.management.page.hooks/useGetClientsLoansStats.js`
- `src/hooks/todayCollections.page.hooks/useGetTodayCollections.js`
- `src/hooks/staff.management.page.hooks/useGetStaffList.js`
- `src/hooks/clients.profile.page.hooks/useGetClientLoans.js`
- `src/hooks/clients.profile.page.hooks/useCreateNewLoan.js`
- `src/hooks/clients.profile.page.hooks/useGetGuarantorsInfo.js`
- `src/hooks/clients.management.page.hooks/useGetClientsList.js`
- `src/hooks/clients.management.page.hooks/useCreateClient.js`
- `src/hooks/branches.management.page.hooks/usebranches.js`
- `src/hooks/branches.management.page.hooks/useCreateBranch.js`
- `src/hooks/branch.details.page.hooks/updateBranchDeatils.js`
- `src/hooks/branch.details.page.hooks/useGetBranchCustomers.js`
- `src/hooks/branch.details.page.hooks/useGetBranchStaffList.js`
- `src/hooks/branch.details.page.hooks/useGetSpecificBranch.js`
- `src/hooks/branch.details.page.hooks/useGetSpecificBranchPerformanceMetrics.js`
- `src/hooks/branch.details.page.hooks/useGetWeeklyLoanSummary.js`
- `src/auth/AuthContext.jsx`

### API Functions Using Base URL

- `src/api/branch-management.js` - Updated to use api client
- `src/api/dashboard.js` - Updated to use API_BASE_URL
- `src/api/settings.js` - Updated to use API_BASE_URL
- `src/hooks/clients.profile.page.hooks/useGetClientProfileInfo.js` - Updated to use API_BASE_URL

### Components Using Base URL for Images

- `src/pages/todays-collection/components/CollectionTable.jsx`
- `src/pages/clients-management/components/clientsListPage.jsx`
- `src/pages/client-profile/components/PersonalInfoTab.jsx`

## How It Works

1. The `src/api/client.js` file creates a centralized axios instance with the base URL
2. All HTTP calls use this instance instead of hardcoding URLs
3. The axios instance automatically prepends the base URL to all relative paths
4. Example:
   - default dev: `api.get("/api/loans")` -> `/api/loans` (proxied by Vite)
   - with env: `api.get("/api/loans")` -> `http://YOUR_API_HOST:3001/api/loans`

## Benefits

- **Single Source of Truth**: Change the URL in one place
- **Environment-Based Configuration**: Use different URLs for development, staging, and production
- **Consistency**: All API calls follow the same pattern
- **Credentials Support**: The axios instance is configured with `withCredentials: true`

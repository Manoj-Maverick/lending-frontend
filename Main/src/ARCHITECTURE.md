# Frontend Architecture

Primary flow:

`Page -> Hook -> Service -> API Client -> Backend`

## Active Folders (Final)

- `api/`
  - `client.js` (axios transport, interceptors, credentials)
  - `endpoints.js` (route constants)
- `services/`
  - domain API calls only (no UI logic)
- `hooks/`
  - `auth/`
  - `branches/`
  - `branchDetails/`
  - `clients/`
  - `collections/`
  - `dashboard/`
  - `loans/`
  - `payments/`
  - `settings/`
  - `staff/`
- `queryKeys/`
  - centralized React Query keys
- `utils/`
  - shared formatting/date helpers
- `components/shared/`
  - reusable shared exports

Legacy `*.page.hooks` folders have been removed.

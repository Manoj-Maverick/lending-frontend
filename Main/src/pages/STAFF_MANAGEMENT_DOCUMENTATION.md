# Staff Management System Documentation

## Overview

The Staff Management system provides a comprehensive solution for managing staff members across different branches. It includes features for staff registration, profile management, document tracking, and performance reviews.

## File Structure

```
staff-management/
├── index.jsx                          # Main staff management page
├── components/
│   ├── AddStaffModal.jsx             # Modal for adding new staff
│   ├── EditStaffModal.jsx            # Modal for editing staff information
│   ├── StaffFilters.jsx              # Filter component for staff list
│   ├── StaffTable.jsx                # Table component displaying staff
│   └── Pagination.jsx                # Pagination component

staff-profile/
├── index.jsx                          # Staff profile main page
├── components/
│   ├── PersonalInfoTab.jsx           # Personal information display
│   ├── DocumentsTab.jsx              # Document management
│   └── PerformanceTab.jsx            # Performance metrics and reviews
```

## Components Overview

### 1. Staff Management Page (`index.jsx`)

Main page displaying all staff members with filtering and pagination capabilities.

**Features:**

- Display all staff members in a responsive table
- Advanced filtering by name, email, phone, branch, and role
- Sorting by multiple columns
- Pagination with customizable items per page
- Add new staff member functionality
- Responsive design (mobile, tablet, desktop)

**State Management:**

- `isAddStaffModalOpen`: Controls add staff modal visibility
- `currentPage`: Current pagination page
- `itemsPerPage`: Number of items displayed per page
- `sortConfig`: Current sorting configuration
- `filters`: Applied filters
- `filteredStaff`: Filtered and sorted staff list

**Key Props:**

- Mock staff data with 8 sample records
- All branches and departments predefined

### 2. Staff Table Component (`StaffTable.jsx`)

Displays staff members in a responsive table/card format.

**Features:**

- Desktop table view with sortable headers
- Mobile card view for smaller screens
- Column visibility toggle
- Color-coded status and role badges
- Quick action buttons (View, Edit, Delete)
- Empty state handling

**Status Colors:**

- Active: Green (`bg-success/10 text-success`)
- On Leave: Amber (`bg-warning/10 text-warning`)
- Inactive: Red (`bg-error/10 text-error`)

**Role Colors:**

- Each role has unique color coding for visual distinction
- Branch Manager: Primary color
- Loan Officer: Blue
- Finance Manager: Emerald
- HR Executive: Pink
- IT Manager: Cyan
- Audit Officer: Orange

### 3. Staff Filters Component (`StaffFilters.jsx`)

Provides filtering and search capabilities.

**Filters:**

- **Search**: Search by name, email, phone, or staff code
- **Branch**: Filter by branch location
- **Role**: Filter by job role

**Features:**

- Active filter pills with clear buttons
- Real-time filtering
- Filter count display
- Responsive design

### 4. Add Staff Modal (`AddStaffModal.jsx`)

Multi-step form for adding new staff members.

**Steps:**

1. **Personal Details** (6 fields)
   - First Name, Last Name
   - Date of Birth, Gender
   - Email, Phone Number, Alternate Phone

2. **Address Information** (4 fields)
   - Address Line 1 & 2
   - City, State, Pincode

3. **Employment Details** (5 fields)
   - Role, Department
   - Branch, Employment Type
   - Join Date

4. **Bank Details** (4 fields)
   - Bank Name
   - Account Number, IFSC Code
   - Account Type

**Features:**

- Progress indicator with step navigation
- Form validation at each step
- Error messages display
- Previous/Next navigation
- Responsive modal design

### 5. Edit Staff Modal (`EditStaffModal.jsx`)

Similar to AddStaffModal but for updating existing staff information.

**Features:**

- Pre-fills form with current staff data
- All 4-step form identical to Add modal
- Status field included for status updates
- Step-by-step navigation

### 6. Pagination Component (`Pagination.jsx`)

Handles pagination for the staff list.

**Features:**

- Page size selector (10, 25, 50, 100 items)
- Previous/Next buttons
- First/Last page navigation
- Page number display
- Mobile-friendly page display
- Dynamic page number calculation

### 7. Staff Profile Page (`staff-profile/index.jsx`)

Displays detailed staff member information with tabs.

**Features:**

- Staff header with ID and status badge
- Three tab sections (Personal, Documents, Performance)
- Back navigation to staff list
- Edit and menu buttons

**Tabs:**

- Personal Info
- Documents
- Performance

### 8. Personal Info Tab (`PersonalInfoTab.jsx`)

Displays staff personal and employment information.

**Sections:**

1. **Profile Header**
   - Staff photo with status indicator
   - Name, ID, and Edit button
   - Quick info cards (Phone, Email, Role, Branch, Status, Employed Since)

2. **Personal Details**
   - Date of Birth, Gender

3. **Employment Details**
   - Department, Employment Type
   - Join Date, Years of Experience

4. **Address Information**
   - Street, City, State, Zip Code

5. **Bank Information**
   - Bank Name, Account Holder
   - Account Number, IFSC Code

### 9. Documents Tab (`DocumentsTab.jsx`)

Manages staff documents and file uploads.

**Features:**

- Grid view of documents with icons
- Status badges (Verified, Pending, Rejected)
- Document details view
- Download functionality
- Upload new document section
- Expandable document details

**Supported Document Types:**

- ID Proof
- Address Proof
- Educational Certificates
- Experience Certificates
- Bank Documents

### 10. Performance Tab (`PerformanceTab.jsx`)

Displays staff performance metrics and reviews.

**Features:**

1. **Overall Rating**
   - 5-star rating display
   - Total ratings count
   - Visual rating representation

2. **Performance Metrics**
   - Client Satisfaction
   - Target Achievement
   - Team Leadership
   - Loan Processing Efficiency
   - Progress bars with color coding

3. **Performance Reviews**
   - Reviewer name and rating
   - Review date
   - Comment/feedback

4. **Statistics Cards**
   - Client Satisfaction percentage
   - Target Achievement percentage
   - Team Leadership rating
   - Loan Processing Efficiency

5. **Action Buttons**
   - Download Report
   - Add Review
   - More options

## Data Structure

### Staff Object

```javascript
{
  id: "ST-001",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@lendweb.com",
  phone: "+91 98765 43210",
  code: "ST-001",
  branch: "Main Branch",
  role: "Branch Manager",
  department: "Management",
  status: "Active",
  joinDate: "2023-01-15",
  photo: "url",
  photoAlt: "description"
}
```

### Document Object

```javascript
{
  id: 1,
  name: "ID Proof - Aadhar",
  type: "ID",
  uploadDate: "2023-01-15",
  status: "Verified",
  fileUrl: "#"
}
```

### Performance Object

```javascript
{
  overallRating: "4.8",
  totalRatings: 125,
  reviews: [...],
  metrics: {
    clientSatisfaction: 92,
    targetAchievement: 110,
    teamLeadership: 95,
    loanProcessing: 98
  }
}
```

## Styling & Theme

All components use:

- **Tailwind CSS** for styling
- **Dark mode support** with CSS variables
- **Responsive design** (mobile-first approach)
- **Consistent color scheme** across components
- **Elevation shadows** for depth
- **Border colors** from theme

### Color Variables Used

- `--color-primary`: Primary action color
- `--color-accent`: Accent highlights
- `--color-secondary`: Secondary elements
- `--color-success`: Success states (green)
- `--color-warning`: Warning states (amber)
- `--color-error`: Error states (red)
- `--color-foreground`: Text color
- `--color-background`: Background color
- `--color-card`: Card background
- `--color-border`: Border color
- `--color-muted`: Muted/secondary text

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (1280px)

## Integration Points

### Routes Required

```javascript
// Add these to your Routes.jsx
<Route path="/staff-management" element={<StaffManagement />} />
<Route path="/staff-profile/:staffId" element={<StaffProfile />} />
```

### API Integration Points

**Create new staff:**

- Endpoint: `POST /api/staff`
- Data: `formData` from AddStaffModal

**Update staff:**

- Endpoint: `PUT /api/staff/:id`
- Data: `formData` from EditStaffModal

**Get staff list:**

- Endpoint: `GET /api/staff`
- Query params: `page`, `limit`, `search`, `branch`, `role`

**Get staff details:**

- Endpoint: `GET /api/staff/:id`

**Upload documents:**

- Endpoint: `POST /api/staff/:id/documents`
- Data: FormData with file

**Get performance reviews:**

- Endpoint: `GET /api/staff/:id/performance`

## Form Validation Rules

### Personal Details Step

- First/Last Name: Required, non-empty
- Date of Birth: Required
- Gender: Required
- Phone: Required, 10 digits
- Email: Required, valid email format

### Address Step

- Address Line 1: Required
- City/State: Required
- Pincode: Required, 6 digits

### Employment Details Step

- Role/Department/Branch: Required
- Employment Type: Required

### Bank Details Step

- Bank Name: Required
- Account Number: Required
- IFSC Code: Required (optional)
- Account Type: Required

## Customization Guide

### Adding New Roles

Update `roleOptions` in AddStaffModal/EditStaffModal:

```javascript
const roleOptions = [
  { value: "New Role", label: "New Role" },
  // ...
];
```

### Adding New Departments

Update `departmentOptions`:

```javascript
const departmentOptions = [
  { value: "New Department", label: "New Department" },
  // ...
];
```

### Adding New Branches

Update `branchOptions`:

```javascript
const branchOptions = [
  { value: "New Branch Name", label: "New Branch Name" },
  // ...
];
```

### Customizing Status Colors

Modify `getStatusColor()` function in StaffTable:

```javascript
const getStatusColor = (status) => {
  const colors = {
    "New Status": "bg-color/10 text-color",
    // ...
  };
  return colors?.[status] || colors?.["Active"];
};
```

## Performance Considerations

1. **Pagination**: Limits rendered items to improve performance
2. **Column Visibility**: Users can hide unnecessary columns
3. **Virtual Scrolling**: Consider implementing for large lists
4. **Lazy Loading**: Implement for images using `AppImage` component
5. **Memoization**: Consider using React.memo for table rows

## Accessibility Features

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- Color contrast compliance
- Focus indicators
- Tab order optimization

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Future Enhancements

1. **Bulk Operations**: Bulk import/export staff
2. **Advanced Reports**: Generate staff reports
3. **Performance Trends**: Track performance over time
4. **Team Analytics**: Department and branch analytics
5. **Schedule Management**: Attendance and scheduling
6. **Leave Management**: Integration with leave system
7. **Payroll Integration**: Link to payroll system
8. **Email Notifications**: Automated staff notifications

## Troubleshooting

### Modal not opening?

- Check if `isAddStaffModalOpen` state is properly set
- Verify button click handler is connected

### Filters not working?

- Ensure `filteredStaff` state is being updated
- Check filter conditions in `useEffect`

### Images not loading?

- Verify image URLs are valid
- Check `AppImage` component configuration

### Styles not applying?

- Ensure Tailwind CSS is properly configured
- Check if dark mode classes are needed
- Verify CSS variable declarations

## Support

For issues or questions, refer to:

- Component inline comments
- Form validation error messages
- Browser console for runtime errors

---

**Last Updated**: January 21, 2026
**Version**: 1.0.0
**Status**: Production Ready

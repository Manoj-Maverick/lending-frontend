import pandas as pd
import random
from datetime import datetime, timedelta
import string
import bcrypt

# ----------------------------
# Helper functions
# ----------------------------
def random_date(start_year=2024, end_year=2027):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def random_pincode():
    return f'{random.randint(600000, 699999)}'  # 6 digits

def random_mobile():
    return f'{random.randint(6000000000, 9999999999)}'  # 10 digits

def random_branch_code(i):
    return f'CDL{i:03d}'

def random_branch_name(location):
    names = ['Main Branch', 'Central Branch', 'East Branch', 'West Branch', 'North Branch', 'South Branch', 'Market Branch']
    return f'{location} {random.choice(names)}'

def random_address(location):
    streets = ['Beach Road', 'Imperial Street', 'Gandhi Nagar', 'Anna Salai', 'Hospital Road', 'MG Road', 'Nehru Street']
    return f'No.{random.randint(1, 200)} {random.choice(streets)}, {location}, Tamil Nadu'

def random_weekday():
    return random.choice(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])

def hash_password(plain_pass: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_pass.encode("utf-8"), salt)
    return hashed.decode("utf-8")

# ----------------------------
# Base data
# ----------------------------
locations = ['Cuddalore', 'Chidambaram', 'Panruti', 'Vadalur', 'Virudhachalam']
first_names = ['Rajesh', 'Suresh', 'Karthik', 'Arun', 'Prakash', 'Murugan', 'Kavya', 'Anitha', 'Rani', 'Vijay', 'Manoj', 'Priya', 'Divya', 'Meena']
last_names = ['Kumar', 'Ramesh', 'Vijay', 'Selvam', 'Murugan', 'Anitha', 'Rani']

# ----------------------------
# Roles
# ----------------------------
roles_df = pd.DataFrame([
    {'role_name': 'ADMIN'},
    {'role_name': 'BRANCH_MANAGER'},
    {'role_name': 'STAFF'},
    {'role_name': 'ACCOUNTANT'}
])

# ----------------------------
# Branches
# ----------------------------
branches = []
for i in range(1, 21):
    loc = random.choice(locations)
    branches.append({
        'branch_code': random_branch_code(i),
        'branch_name': random_branch_name(loc),
        'address': random_address(loc),
        'location': loc,
        'pincode': random_pincode(),
        'branch_mobile': random_mobile(),
        'branch_type': 'MAIN' if i == 1 else 'REGULAR',
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
branches_df = pd.DataFrame(branches)

# ----------------------------
# Users (with bcrypt + plain_password)
# ----------------------------
users = []

admin_pass = "admin123"
users.append({
    'full_name': 'Main Admin',
    'username': 'admin',
    'password_hash': hash_password(admin_pass),
    'plain_password': admin_pass,
    'role_id': 1,          # ADMIN
    'branch_id': None,
    'is_active': True,
    'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
})

user_count = 1
for _ in range(60):
    user_count += 1
    fname = random.choice(first_names) + " " + random.choice(last_names)
    uname = fname.lower().replace(" ", "_") + str(user_count)
    pwd = ''.join(random.choices(string.ascii_letters + string.digits + "!@#$", k=8))

    role_id = random.choice([2, 3, 4])  # manager, staff, accountant
    branch_id = random.randint(1, 20)

    users.append({
        'full_name': fname,
        'username': uname,
        'password_hash': hash_password(pwd),
        'plain_password': pwd,
        'role_id': role_id,
        'branch_id': branch_id,
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })

users_df = pd.DataFrame(users)

# ----------------------------
# Employees (matches your real table: includes role_id, branch_id)
# ----------------------------
employees = []
emp_no = 1

for idx, user in users_df.iterrows():
    if user['username'] == 'admin':
        continue

    employees.append({
        'user_id': idx + 1,  # relies on insert order of users
        'employee_code': f'EMP{emp_no:04d}',
        'full_name': user['full_name'],
        'phone': random_mobile(),
        'email': f"{user['username']}@example.com",
        'address': random_address(random.choice(locations)),
        'city': 'Cuddalore',
        'state': 'Tamil Nadu',
        'pincode': random_pincode(),
        'designation': random.choice(['Branch Manager', 'Staff', 'Accountant', 'Clerk']),
        'join_date': random_date(2024, 2025).strftime('%Y-%m-%d'),
        'salary': round(random.uniform(20000, 80000), 2),
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S'),
        'role_id': int(user['role_id']),
        'branch_id': int(user['branch_id']) if pd.notna(user['branch_id']) else None
    })
    emp_no += 1

employees_df = pd.DataFrame(employees)

# ----------------------------
# Customers
# ----------------------------
customers = []
for i in range(1, 501):
    fname = random.choice(first_names) + " " + random.choice(last_names)
    customers.append({
        'customer_code': f'CUS{i:04d}',
        'branch_id': random.randint(1, 20),
        'full_name': fname,
        'phone': random_mobile(),
        'alternate_phone': None,
        'address': random_address(random.choice(locations)),
        'city': 'Cuddalore',
        'pincode': random_pincode(),
        'bank_account_no': ''.join(random.choices(string.digits, k=12)),
        'bank_name': random.choice(['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Indian Bank']),
        'ifsc_code': f"SBIN0{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}",
        'is_blacklisted': False,
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
customers_df = pd.DataFrame(customers)

# ----------------------------
# Guarantors
# ----------------------------
guarantors = []
for _ in range(300):
    fname = random.choice(first_names) + " " + random.choice(last_names)
    guarantors.append({
        'customer_id': random.randint(1, 500),
        'full_name': fname,
        'phone': random_mobile(),
        'address': random_address(random.choice(locations)),
        'relation': random.choice(['Friend', 'Relative', 'Neighbor']),
        'aadhar_number': ''.join(random.choices(string.digits, k=12)),
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
guarantors_df = pd.DataFrame(guarantors)

# ----------------------------
# Loans
# ----------------------------
loans = []
for i in range(1, 1001):
    principal = round(random.uniform(10000, 200000), 2)
    interest = round(principal * random.uniform(0.05, 0.15), 2)
    total = round(principal + interest, 2)
    tenure = random.randint(5, 20)
    weekly = round(total / tenure, 2)

    loans.append({
        'loan_code': f'LN{i:05d}',
        'customer_id': random.randint(1, 500),
        'branch_id': random.randint(1, 20),
        'parent_loan_id': None,
        'principal_amount': principal,
        'interest_amount': interest,
        'total_payable': total,
        'tenure_weeks': tenure,
        'weekly_amount': weekly,
        'start_date': random_date(2024, 2026).strftime('%Y-%m-%d'),
        'status': random.choice(['ACTIVE', 'CLOSED', 'FORECLOSED']),
        'closure_reason': None,
        'week_day': random_weekday(),
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
loans_df = pd.DataFrame(loans)

# ----------------------------
# Settings (JSONB)
# ----------------------------
# ----------------------------
# Settings (JSONB) - matches React UI defaults
# ----------------------------
settings_df = pd.DataFrame([
    {
        'setting_key': 'general',
        'setting_value': """
        {
          "organizationName": "SDFC - Secured Deposit Finance Corporation",
          "organizationEmail": "info@sdfc.com",
          "organizationPhone": "+1 (555) 123-4567",
          "website": "www.sdfc.com",
          "timezone": "IST",
          "dateFormat": "DD/MM/YYYY",
          "currency": "INR",
          "language": "English"
        }
        """,
        'description': 'General organization settings',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    },
    {
        'setting_key': 'loan',
        'setting_value': """
        {
          "defaultInterestRate": 12.5,
          "maxLoanAmount": 500000,
          "minLoanAmount": 10000,
          "defaultTenure": 24,
          "maxTenure": 60,
          "minTenure": 6,
          "processingFeePercentage": 2.5,
          "penaltyInterestRate": 18,
          "overdueThresholdDays": 30
        }
        """,
        'description': 'Loan default configuration',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    },
    {
        'setting_key': 'email',
        'setting_value': """
        {
          "smtpServer": "smtp.gmail.com",
          "smtpPort": "587",
          "smtpUsername": "noreply@sdfc.com",
          "enableSslTls": true,
          "enableEmailNotifications": true,
          "enableLoanReminders": true,
          "enablePaymentReceipts": true,
          "enableApprovalNotifications": true
        }
        """,
        'description': 'Email and notification settings',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    },
    {
        'setting_key': 'security',
        'setting_value': """
        {
          "enableTwoFactor": false,
          "sessionTimeout": 30,
          "passwordExpiryDays": 90,
          "minPasswordLength": 8,
          "requireUpperCase": true,
          "requireNumbers": true,
          "requireSpecialChars": true,
          "loginAttempts": 3
        }
        """,
        'description': 'Security and password policy settings',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    }
])


# ----------------------------
# SQL Generator (handles 9.0 -> 9)
# ----------------------------
def generate_inserts(df, table_name):
    inserts = []
    columns = list(df.columns)

    for _, row in df.iterrows():
        values = []
        for col in columns:
            val = row[col]

            if pd.isna(val):
                values.append("NULL")
            elif isinstance(val, bool):
                values.append("TRUE" if val else "FALSE")
            elif isinstance(val, int):
                values.append(str(val))
            elif isinstance(val, float):
                if val.is_integer():
                    values.append(str(int(val)))
                else:
                    values.append(str(val))
            else:
                v = str(val).replace("'", "''")
                values.append(f"'{v}'")

        inserts.append(
            f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});"
        )

    return inserts

# ----------------------------
# Build SQL in FK-safe order
# ----------------------------
sql_output = []

sql_output.append("-- Roles")
sql_output.extend(generate_inserts(roles_df, "roles"))

sql_output.append("\n-- Branches")
sql_output.extend(generate_inserts(branches_df, "branches"))

sql_output.append("\n-- Users (plain passwords kept in column for dev)")
sql_output.extend(generate_inserts(users_df, "users"))

sql_output.append("\n-- Employees")
sql_output.extend(generate_inserts(employees_df, "employees"))

sql_output.append("\n-- Customers")
sql_output.extend(generate_inserts(customers_df, "customers"))

sql_output.append("\n-- Guarantors")
sql_output.extend(generate_inserts(guarantors_df, "guarantors"))

sql_output.append("\n-- Loans")
sql_output.extend(generate_inserts(loans_df, "loans"))

sql_output.append("\n-- Settings")
sql_output.extend(generate_inserts(settings_df, "settings"))

# ----------------------------
# Write to file with TRUNCATE
# ----------------------------
with open("seed.sql", "w", encoding="utf-8") as f:
    f.write("""-- RESET ALL DATA (DEV ONLY)
TRUNCATE TABLE
    payments,
    loan_schedule,
    loan_guarantors,
    loans,
    guarantor_documents,
    customer_documents,
    guarantors,
    customers,
    employees,
    users,
    branches,
    roles,
    settings
RESTART IDENTITY CASCADE;

""")
    f.write("\n".join(sql_output))

print("✅ seed.sql generated successfully")

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

def add_days(date_str, days):
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return (d + timedelta(days=days)).strftime("%Y-%m-%d")

def random_pincode():
    return f'{random.randint(600000, 699999)}'

def random_mobile():
    return f'{random.randint(6000000000, 9999999999)}'

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

# Map weekday string to Python weekday index (Mon=0 .. Sun=6)
WEEKDAY_MAP = {'MON': 0, 'TUE': 1, 'WED': 2, 'THU': 3, 'FRI': 4, 'SAT': 5, 'SUN': 6}

def next_weekday(date_str, target_weekday_str):
    """Return the next date (strictly after date_str) that matches target_weekday_str."""
    d = datetime.strptime(date_str, "%Y-%m-%d")
    target = WEEKDAY_MAP[target_weekday_str]
    days_ahead = (target - d.weekday() + 7) % 7
    if days_ahead == 0:
        days_ahead = 7  # ensure it's the NEXT occurrence, not same day
    return (d + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

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
# Users
# ----------------------------
users = []
admin_pass = "admin123"
users.append({
    'full_name': 'Main Admin',
    'username': 'admin',
    'password_hash': hash_password(admin_pass),
    'role_id': 1,
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

    users.append({
        'full_name': fname,
        'username': uname,
        'password_hash': hash_password(pwd),
        'role_id': random.choice([2, 3, 4]),
        'branch_id': random.randint(1, 20),
        'is_active': True,
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })

users_df = pd.DataFrame(users)

# ----------------------------
# Employees (copy role_id, branch_id from users)
# ----------------------------
employees = []
emp_no = 1
for idx, user in users_df.iterrows():
    if user['username'] == 'admin':
        continue
    employees.append({
        'user_id': idx + 1,
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
# Customer Documents
# ----------------------------
customer_documents = []
for i in range(1, 301):
    customer_documents.append({
        'customer_id': random.randint(1, 500),
        'document_type': random.choice(['AADHAR', 'PAN', 'VOTER_ID']),
        'document_number': ''.join(random.choices(string.digits, k=12)),
        'file_url': f"https://files.example.com/customer_doc_{i}.pdf",
        'is_active': True,
        'uploaded_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
customer_documents_df = pd.DataFrame(customer_documents)

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
# Guarantor Documents
# ----------------------------
guarantor_documents = []
for i in range(1, 201):
    guarantor_documents.append({
        'guarantor_id': random.randint(1, len(guarantors_df)),
        'document_type': random.choice(['AADHAR', 'PAN']),
        'document_number': ''.join(random.choices(string.digits, k=12)),
        'file_url': f"https://files.example.com/guarantor_doc_{i}.pdf",
        'is_active': True,
        'uploaded_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
guarantor_documents_df = pd.DataFrame(guarantor_documents)

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

    disbursement_date = random_date(2024, 2026).strftime('%Y-%m-%d')
    # First due date = 7 days after disbursement
    first_due_dt = datetime.strptime(disbursement_date, "%Y-%m-%d") + timedelta(days=7)

    # Derive weekday from that date
    wday = ['MON','TUE','WED','THU','FRI','SAT','SUN'][first_due_dt.weekday()]

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
        'start_date': disbursement_date,   # disbursement date
        'status': 'ACTIVE',
        'closure_reason': None,
        'week_day': wday,                   # collection weekday
        'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    })
loans_df = pd.DataFrame(loans)

# ----------------------------
# Loan Schedule (PLAN) + Payments (ACTUAL) — WEEKDAY-ALIGNED
# ----------------------------
loan_schedules = []
payments = []

schedule_id = 1

for loan_idx, loan in loans_df.iterrows():
    loan_id = loan_idx + 1

    if loan['status'] != 'ACTIVE':
        continue

    tenure = int(loan['tenure_weeks'])
    weekly_amount = float(loan['weekly_amount'])
    start_date = loan['start_date']   # disbursement date
    week_day = loan['week_day']        # target weekday

    # Compute first due date = next occurrence of week_day after start_date
    first_due_date = next_weekday(start_date, week_day)

    # 1) Create FULL schedule: week 1..N, all PENDING
    for i in range(1, tenure + 1):
        due_date = add_days(first_due_date, (i - 1) * 7)

        loan_schedules.append({
            'loan_id': loan_id,
            'week_no': i,
            'due_date': due_date,
            'due_amount': weekly_amount,
            'status': 'PENDING',
            'fine_amount': 0,
            'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
        })

    # 2) Simulate some payments for FIRST few weeks only
    paid_weeks = random.randint(0, tenure)

    for i in range(1, paid_weeks + 1):
        idx = len(loan_schedules) - tenure + (i - 1)

        is_late = (i == paid_weeks and random.choice([True, False]))
        fine = round(random.uniform(50, 500), 2) if is_late else 0

        loan_schedules[idx]['status'] = 'DELAYED' if is_late else 'PAID'
        loan_schedules[idx]['fine_amount'] = fine

        payments.append({
            'loan_id': loan_id,
            'schedule_id': schedule_id + (i - 1),
            'paid_amount': weekly_amount,
            'paid_date': loan_schedules[idx]['due_date'],
            'payment_mode': random.choice(['CASH', 'ONLINE']),
            'reference_no': ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)),
            'is_late': is_late,
            'fine_paid': fine,
            'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
        })

    if paid_weeks == tenure:
        loans_df.at[loan_idx, 'status'] = 'CLOSED'

    schedule_id += tenure

loan_schedule_df = pd.DataFrame(loan_schedules)
payments_df = pd.DataFrame(payments)

# ----------------------------
# Loan Guarantors
# ----------------------------
loan_guarantors = []
for loan_idx, loan in loans_df.iterrows():
    loan_id = loan_idx + 1
    chosen = guarantors_df.sample(random.choice([1, 2]))
    for _, g in chosen.iterrows():
        loan_guarantors.append({
            'loan_id': loan_id,
            'guarantor_id': int(g.name) + 1,
            'created_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
        })
loan_guarantors_df = pd.DataFrame(loan_guarantors)

# ----------------------------
# Settings
# ----------------------------
settings_df = pd.DataFrame([
    {
        'setting_key': 'general',
        'setting_value': '{"organizationName":"SDFC","currency":"INR"}',
        'description': 'General organization settings',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    },
    {
        'setting_key': 'loan',
        'setting_value': '{"defaultInterestRate":12.5,"penaltyInterestRate":18}',
        'description': 'Loan default configuration',
        'updated_by': 1,
        'updated_at': random_date().strftime('%Y-%m-%d %H:%M:%S')
    }
])

# ----------------------------
# SQL Generator
# ----------------------------
def generate_inserts(df, table_name):
    inserts = []
    cols = list(df.columns)
    for _, row in df.iterrows():
        vals = []
        for c in cols:
            v = row[c]
            if pd.isna(v):
                vals.append("NULL")
            elif isinstance(v, bool):
                vals.append("TRUE" if v else "FALSE")
            elif isinstance(v, (int, float)):
                vals.append(str(v))
            else:
                s = str(v).replace("'", "''")
                vals.append(f"'{s}'")
        inserts.append(f"INSERT INTO {table_name} ({', '.join(cols)}) VALUES ({', '.join(vals)});")
    return inserts

# ----------------------------
# Build SQL (FK SAFE ORDER)
# ----------------------------
sql_output = []
sql_output += generate_inserts(roles_df, "roles")
sql_output += generate_inserts(branches_df, "branches")
sql_output += generate_inserts(users_df, "users")
sql_output += generate_inserts(employees_df, "employees")
sql_output += generate_inserts(customers_df, "customers")
sql_output += generate_inserts(customer_documents_df, "customer_documents")
sql_output += generate_inserts(guarantors_df, "guarantors")
sql_output += generate_inserts(guarantor_documents_df, "guarantor_documents")
sql_output += generate_inserts(loans_df, "loans")
sql_output += generate_inserts(loan_guarantors_df, "loan_guarantors")
sql_output += generate_inserts(loan_schedule_df, "loan_schedule")
sql_output += generate_inserts(payments_df, "payments")
sql_output += generate_inserts(settings_df, "settings")

# ----------------------------
# Write file
# ----------------------------
with open("seed.sql", "w", encoding="utf-8") as f:
    f.write("""TRUNCATE TABLE
payments,
loan_schedule,
loan_guarantors,
guarantor_documents,
customer_documents,
loans,
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

print("✅ seed.sql generated with WEEKDAY-ALIGNED schedules and synced payments")

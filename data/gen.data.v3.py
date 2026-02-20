import pandas as pd
import random
from datetime import datetime, timedelta
import string
import bcrypt

# ============================
# Time control (REALISTIC)
# ============================
TODAY = datetime.today().date()
BASE_DATE = TODAY - timedelta(days=180)   # system started ~6 months ago

def days_after(base, days):
    return (base + timedelta(days=days)).strftime("%Y-%m-%d")

def ts_after(base, days):
    return (base + timedelta(days=days, hours=random.randint(0,23), minutes=random.randint(0,59))).strftime("%Y-%m-%d %H:%M:%S")

# ============================
# Helpers
# ============================
def random_pincode():
    return f'{random.randint(600000, 699999)}'

def random_mobile():
    return f'{random.randint(6000000000, 9999999999)}'

def random_branch_code(i):
    return f'CDL{i:03d}'

def random_address(location):
    streets = ['Gandhi Nagar', 'Anna Salai', 'MG Road', 'Nehru Street', 'Market Road']
    return f'No.{random.randint(1,200)}, {random.choice(streets)}, {location}, Tamil Nadu'

def hash_password(p):
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

WEEKDAY_MAP = {'MON':0,'TUE':1,'WED':2,'THU':3,'FRI':4,'SAT':5,'SUN':6}
WEEKDAYS = list(WEEKDAY_MAP.keys())

def next_weekday(date_str, target):
    d = datetime.strptime(date_str, "%Y-%m-%d").date()
    t = WEEKDAY_MAP[target]
    delta = (t - d.weekday() + 7) % 7
    if delta == 0:
        delta = 7
    return (d + timedelta(days=delta)).strftime("%Y-%m-%d")

def fake_aadhaar():
    num = ''.join(random.choices(string.digits, k=12))
    return "enc_"+num, num[-4:]

def fake_pan():
    num = ''.join(random.choices(string.ascii_uppercase+string.digits, k=10))
    return "enc_"+num, num[-4:]

# ============================
# Base Data
# ============================
locations = ['Cuddalore', 'Chidambaram', 'Panruti', 'Vadalur', 'Virudhachalam']
first_names = ['Rajesh','Suresh','Karthik','Arun','Prakash','Murugan','Kavya','Anitha','Rani','Vijay','Manoj','Priya','Divya','Meena']
last_names = ['Kumar','Ramesh','Vijay','Selvam','Murugan','Iyer','Das']

# ============================
# Roles
# ============================
roles_df = pd.DataFrame([
    {'role_name':'ADMIN'},
    {'role_name':'BRANCH_MANAGER'},
    {'role_name':'STAFF'},
    {'role_name':'ACCOUNTANT'}
])

# ============================
# Branches
# ============================
branches = []
for i in range(1, 21):
    loc = random.choice(locations)
    branches.append({
        'branch_code': random_branch_code(i),
        'branch_name': f"{loc} Branch",
        'address': random_address(loc),
        'location': loc,
        'pincode': random_pincode(),
        'branch_mobile': random_mobile(),
        'branch_type': 'MAIN' if i==1 else 'REGULAR',
        'is_active': True,
        'created_at': ts_after(BASE_DATE, i)
    })
branches_df = pd.DataFrame(branches)

# ============================
# Users
# ============================
users = []
users.append({
    'full_name':'Main Admin',
    'username':'admin',
    'password_hash': hash_password("admin123"),
    'role_id':1,
    'branch_id': None,
    'is_active': True,
    'created_at': ts_after(BASE_DATE, 1),
    'plain_password': 'admin123'
})

uid = 1
for i in range(2, 61):
    fname = random.choice(first_names)+" "+random.choice(last_names)
    uname = fname.lower().replace(" ","_")+str(i)
    pwd = ''.join(random.choices(string.ascii_letters+string.digits, k=8))
    users.append({
        'full_name': fname,
        'username': uname,
        'password_hash': hash_password(pwd),
        'role_id': random.choice([2,3,4]),
        'branch_id': random.randint(1,20),
        'is_active': True,
        'created_at': ts_after(BASE_DATE, i+2),
        'plain_password': pwd
    })
users_df = pd.DataFrame(users)

# ============================
# Employees
# ============================
employees = []
emp_no = 1
for idx,u in users_df.iterrows():
    if u['username']=='admin':
        continue
    employees.append({
        'user_id': idx+1,
        'employee_code': f'EMP{emp_no:04d}',
        'full_name': u['full_name'],
        'phone': random_mobile(),
        'email': u['username']+"@example.com",
        'address': random_address(random.choice(locations)),
        'city':'Cuddalore',
        'state':'Tamil Nadu',
        'pincode': random_pincode(),
        'designation':'Staff',
        'join_date': days_after(BASE_DATE, 10+emp_no),
        'salary': round(random.uniform(20000,80000),2),
        'is_active': True,
        'created_at': ts_after(BASE_DATE, 10+emp_no),
        'role_id': int(u['role_id']),
        'branch_id': int(u['branch_id']) if pd.notna(u['branch_id']) else None
    })
    emp_no+=1
employees_df = pd.DataFrame(employees)

# ============================
# Customers
# ============================
customers=[]
for i in range(1,501):
    name = random.choice(first_names)+" "+random.choice(last_names)
    aad_enc, aad_last = fake_aadhaar()
    customers.append({
        'customer_code': f'CUS{i:04d}',
        'branch_id': random.randint(1,20),
        'full_name': name,
        'phone': random_mobile(),
        'alternate_phone': None,
        'email': None,
        'address': random_address(random.choice(locations)),
        'city':'Cuddalore',
        'state':'Tamil Nadu',
        'pincode': random_pincode(),
        'bank_account_no': ''.join(random.choices(string.digits,k=12)),
        'bank_name': random.choice(['SBI','HDFC','ICICI','Indian Bank']),
        'ifsc_code': f"SBIN0{''.join(random.choices(string.ascii_uppercase+string.digits,k=6))}",
        'account_holder_name': name,
        'dob': days_after(BASE_DATE, -random.randint(8000,15000)),
        'gender': random.choice(['MALE','FEMALE']),
        'marital_status': random.choice(['SINGLE','MARRIED']),
        'occupation': random.choice(['Driver','Worker','Shopkeeper','Farmer']),
        'monthly_income': round(random.uniform(8000,40000),2),
        'aadhaar_enc': aad_enc,
        'aadhaar_last4': aad_last,
        'pan_enc': None,
        'pan_last4': None,
        'is_blacklisted': False,
        'is_active': True,
        'created_at': ts_after(BASE_DATE, 20+i)
    })
customers_df = pd.DataFrame(customers)

# ============================
# Guarantors
# ============================
guarantors=[]
for i in range(1,301):
    name = random.choice(first_names)+" "+random.choice(last_names)
    pan_enc, pan_last = fake_pan()
    guarantors.append({
        'customer_id': random.randint(1,500),
        'full_name': name,
        'phone': random_mobile(),
        'alternate_phone': None,
        'email': None,
        'address': random_address(random.choice(locations)),
        'city':'Cuddalore',
        'state':'Tamil Nadu',
        'pincode': random_pincode(),
        'relation': random.choice(['Friend','Brother','Sister','Neighbor']),
        'aadhaar_enc': None,
        'aadhaar_last4': None,
        'pan_enc': pan_enc,
        'pan_last4': pan_last,
        'is_active': True,
        'created_at': ts_after(BASE_DATE, 30+i),
        'occupation': 'Worker',
        'monthly_income': round(random.uniform(8000,30000),2)
    })
guarantors_df = pd.DataFrame(guarantors)

# ============================
# Loans
# ============================
loans=[]
for i in range(1,1001):
    cust = customers_df.sample(1).iloc[0]
    principal = round(random.uniform(10000,200000),2)
    interest = round(principal*random.uniform(0.05,0.15),2)
    total = principal+interest
    tenure = random.randint(8,20)
    weekly = round(total/tenure,2)

    start = BASE_DATE + timedelta(days=random.randint(1,120))
    wday = random.choice(WEEKDAYS)

    loans.append({
        'loan_code': f'LN{i:05d}',
        'customer_id': int(cust.name)+1,
        'branch_id': int(cust['branch_id']),
        'parent_loan_id': None,
        'principal_amount': principal,
        'interest_amount': interest,
        'total_payable': total,
        'tenure_weeks': tenure,
        'weekly_amount': weekly,
        'start_date': start.strftime("%Y-%m-%d"),
        'status': 'ACTIVE',
        'closure_reason': None,
        'created_at': ts_after(start, 0),
        'week_day': wday
    })
loans_df = pd.DataFrame(loans)

# ============================
# Loan Schedule + Payments
# ============================
loan_schedules=[]
payments=[]
sid=1

for idx,l in loans_df.iterrows():
    loan_id = idx+1
    tenure = int(l['tenure_weeks'])
    weekly = float(l['weekly_amount'])
    start = l['start_date']
    wday = l['week_day']

    first_due = next_weekday(start, wday)

    paid_weeks = random.randint(0, tenure)

    for w in range(1, tenure+1):
        due = (datetime.strptime(first_due,"%Y-%m-%d").date() + timedelta(days=(w-1)*7)).strftime("%Y-%m-%d")
        status = 'PENDING'
        fine = 0

        if w <= paid_weeks:
            late = random.choice([False, False, True])
            status = 'DELAYED' if late else 'PAID'
            fine = round(random.uniform(50,300),2) if late else 0

            payments.append({
                'loan_id': loan_id,
                'schedule_id': sid,
                'paid_amount': weekly,
                'paid_date': due,
                'payment_mode': random.choice(['CASH','ONLINE']),
                'reference_no': ''.join(random.choices(string.ascii_uppercase+string.digits,k=10)),
                'is_late': late,
                'fine_paid': fine,
                'created_at': ts_after(datetime.strptime(due,"%Y-%m-%d").date(), 0)
            })

        loan_schedules.append({
            'loan_id': loan_id,
            'week_no': w,
            'due_date': due,
            'due_amount': weekly,
            'status': status,
            'fine_amount': fine,
            'created_at': ts_after(datetime.strptime(due,"%Y-%m-%d").date(), -7)
        })
        sid+=1

    if paid_weeks == tenure:
        loans_df.at[idx,'status']='CLOSED'
        loans_df.at[idx,'closure_reason']='All repayments completed'

loan_schedule_df = pd.DataFrame(loan_schedules)
payments_df = pd.DataFrame(payments)

# ============================
# Loan Guarantors
# ============================
loan_guarantors=[]
for idx,_ in loans_df.iterrows():
    chosen = guarantors_df.sample(random.choice([1,2]))
    for _,g in chosen.iterrows():
        loan_guarantors.append({
            'loan_id': idx+1,
            'guarantor_id': int(g.name)+1,
            'created_at': ts_after(BASE_DATE, 60)
        })
loan_guarantors_df = pd.DataFrame(loan_guarantors)

# ============================
# Settings (UNCHANGED)
# ============================
settings_df = pd.DataFrame([
    {
        'setting_key':'general',
        'setting_value':'{"organizationName":"SDFC","currency":"INR"}',
        'description':'General organization settings',
        'updated_by':1,
        'updated_at': ts_after(BASE_DATE, 1)
    },
    {
        'setting_key':'loan',
        'setting_value':'{"defaultInterestRate":12.5,"penaltyInterestRate":18}',
        'description':'Loan default configuration',
        'updated_by':1,
        'updated_at': ts_after(BASE_DATE, 1)
    }
])

# ============================
# SQL Generator
# ============================
def generate_inserts(df, table):
    out=[]
    cols=list(df.columns)
    for _,r in df.iterrows():
        vals=[]
        for c in cols:
            v=r[c]
            if pd.isna(v): vals.append("NULL")
            elif isinstance(v,bool): vals.append("TRUE" if v else "FALSE")
            elif isinstance(v,(int,float)): vals.append(str(v))
            else: vals.append("'" + str(v).replace("'","''") + "'")
        out.append(f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({', '.join(vals)});")
    return out

sql=[]
sql+=generate_inserts(roles_df,"roles")
sql+=generate_inserts(branches_df,"branches")
sql+=generate_inserts(users_df,"users")
sql+=generate_inserts(employees_df,"employees")
sql+=generate_inserts(customers_df,"customers")
sql+=generate_inserts(guarantors_df,"guarantors")
sql+=generate_inserts(loans_df,"loans")
sql+=generate_inserts(loan_guarantors_df,"loan_guarantors")
sql+=generate_inserts(loan_schedule_df,"loan_schedule")
sql+=generate_inserts(payments_df,"payments")
sql+=generate_inserts(settings_df,"settings")

with open("seed.sql","w",encoding="utf-8") as f:
    f.write("""TRUNCATE TABLE
payments,
loan_schedule,
loan_guarantors,
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
    f.write("\n".join(sql))

print("✅ seed.sql generated (schema-accurate, realistic timeline, FK-safe)")

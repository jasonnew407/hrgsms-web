# HRGSMS - Hotel Reservation and Guest Services Management System

Complete setup guide.

---

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher) - [Download](https://nodejs.org)
* **Git** - [Download](https://git-scm.com)
* **VS Code** - [Download](https://code.visualstudio.com)
* **MySQL Workbench** - [Download](https://dev.mysql.com/downloads/workbench)
* **GitHub Desktop** (Optional) - [Download](https://desktop.github.com)

---

## Installation

🔴 **You need to clone dev branch**

### Step 1: Clone Repository

**Option A: Git Command Line**
```bash
git clone https://github.com/Nepul1234/HRGSMS-ADBMS-Project.git

cd HRGSMS-ADBMS-Project
```

**Option B: GitHub Desktop**
```bash
Open GitHub Desktop
Click File → Clone Repository
Go to URL tab
Paste: https://github.com/Nepul1234/HRGSMS-ADBMS-Project.git
Choose save location
Click Clone
```

### Step 2: Open in VS Code:
```bash
Click Repository → Open in Visual Studio Code

Manually:

Open VS Code
Click File → Open Folder
Select HRGSMS folder
```

### Step 3: Install Frontend Dependencies
```bash
cd client
npm install
```

### Step 4: Install Backend Dependencies
```bash
cd .. (make sure you are in root directory)
npm install
```

### Step 5: Create .env File
- Navigate to server/ folder
- Create new file named .env
- Copy and paste the following:
```bash
# Server Configuration
PORT=5000

# Azure MySQL Database
DB_HOST=hrgsms-mysql-server.mysql.database.azure.com
DB_USER=testadmin
DB_PASSWORD=test-hrgsms-4321
DB_NAME=hrgsms_db
DB_PORT=3306
```

### Step 6: Run Application
You need TWO terminal windows running simultaneously.

**Terminal 1 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

### Step 7: Connect MySQL Workbench
1. Open **MySQL Workbench**
2. Click "+" next to MySQL Connections
3. Fill in connection details: 

| Field | Value |
|-------|-------|
| Connection Name | `HRGSMS Azure Database` |
| Hostname | `hrgsms-mysql-server.mysql.database.azure.com` |
| Port | `3306` |
| Username | `testadmin` |
| Password | `test-hrgsms-4321` (click "Store in Vault") |

4. Go to **SSL** tab
5. Set **Use SSL** to: **Require**
6. Click **Test Connection**
7. Should show: "Successfully connected"
8. Click **OK** to save
9. Double-click connection to open

### Step 7: Check DB connection on Project
```bash
cd server
node test-connection.js
```

You can see this in terminal:
```bash
✅ Database connected successfully!
```

## Verification Checklist

After setup, verify:

- `client/node_modules` folder exists
- `in root node_modules` folder exists
- `server/.env` file exists with correct credentials
- Frontend running on http://localhost:5173
- Backend running on http://localhost:3000
- MySQL Workbench connected successfully
- Can see `hrgsms_db` database in Workbench

## Project Structure
```bash
HRGSMS-ADBMS-Project/
│
├── client/                # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── server/                # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── .env              # ⚠️ Create this file
│   └── ...
│
├── package.json          # Root package.json
├── package-lock.json     # Root package-lock.json
└── 
```

Follow above steps correctly and setup project successfully.

# 🏗️ NorexProject - Architecture Overview

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┐      ┌────────────────────────┐   │
│  │   GUI Desktop App      │      │   CLI Commands         │   │
│  │   (PySide6/Qt6)        │      │   (Bash Scripts)       │   │
│  │                        │      │                        │   │
│  │  • Status Monitoring   │      │  • start.sh           │   │
│  │  • Service Control     │      │  • stop.sh            │   │
│  │  • Settings Panel      │      │  • switch-php.sh      │   │
│  │  • Log Viewer          │      │  • status.sh          │   │
│  │  • Quick Access        │      │  • backup-db.sh       │   │
│  └────────────────────────┘      └────────────────────────┘   │
│              │                              │                  │
│              └──────────────┬───────────────┘                  │
│                             │                                  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    Docker Compose                               │
│                 (docker-compose.yml)                            │
│                                                                 │
│   Manages 3 containers in isolated network:                    │
│   • norex_apache (Web Server)                                   │
│   • norex_mysql (Database)                                      │
│   • norex_pma (Admin Tool)                                      │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Web Container   │ │  MySQL Container │ │  PMA Container   │
│  (norex_apache)   │ │  (norex_mysql)    │ │  (norex_pma)      │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│                  │ │                  │ │                  │
│  Apache 2.4      │ │  MySQL 8.0       │ │  phpMyAdmin      │
│  PHP 8.1/8.2/8.3 │ │                  │ │                  │
│                  │ │  Database:       │ │  Web UI for DB   │
│  Extensions:     │ │  - norex_db       │ │  management      │
│  • mysqli        │ │                  │ │                  │
│  • pdo           │ │  User: root      │ │  Access:         │
│  • gd            │ │  Pass: 041201    │ │  localhost:8081  │
│  • zip           │ │                  │ │                  │
│  • intl          │ │  Port: 3306      │ │                  │
│  • opcache       │ │                  │ │                  │
│  • ...more       │ │                  │ │                  │
│                  │ │                  │ │                  │
│  Port: 80→8080   │ │  Persistent:     │ │  Port: 80→8081   │
│                  │ │  ./data/mysql/   │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Docker Network  │
                    │  (norex_network)  │
                    └──────────────────┘
```

---

## 🔄 Data Flow

### 1. User Interaction → Service Control

```
User (GUI/CLI) → Docker Compose → Containers → Services
```

**Example: Start Services**
```
1. User clicks "Start" in GUI
   or runs: bash scripts/start.sh

2. GUI/Script executes: docker compose up -d

3. Docker Compose reads docker-compose.yml

4. Docker starts 3 containers:
   - norex_apache (web)
   - norex_mysql (db)
   - norex_pma (admin)

5. Services become available:
   - http://localhost:8080 (web)
   - localhost:3306 (mysql)
   - http://localhost:8081 (pma)

6. GUI updates status indicators to green
```

### 2. PHP Request Processing

```
Browser → Apache → PHP → MySQL → PHP → Apache → Browser
```

**Example: Database Query**
```
1. User opens: http://localhost:8080/db_test.php

2. Apache receives HTTP request

3. PHP interpreter processes the file

4. PHP connects to MySQL:
   $conn = new mysqli('db', 'root', '041201', 'norex_db');

5. MySQL executes query

6. PHP receives result

7. PHP generates HTML response

8. Apache sends response to browser

9. Browser displays result
```

### 3. Settings Configuration

```
User → GUI Settings → docker-compose.yml → Docker → Services
```

**Example: Change Port**
```
1. User opens Settings in GUI

2. Changes web port from 8080 to 80

3. Clicks "Save & Apply"

4. GUI validates (no conflicts)

5. GUI creates backup: docker-compose.yml.backup

6. GUI updates docker-compose.yml:
   ports: "80:80"  # was "8080:80"

7. User restarts services

8. Docker recreates containers with new port

9. Web accessible at: http://localhost (port 80)
```

---

## 🧵 Threading Model (GUI)

```
┌─────────────────────────────────────────────────────────────┐
│                        Main Process                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────┐         ┌────────────────────┐    │
│  │   Main Thread      │         │   Worker Thread    │    │
│  │   (UI Rendering)   │         │   (Commands)       │    │
│  │                    │         │                    │    │
│  │  • Display Window  │◄───────►│  • Execute bash    │    │
│  │  • Handle Clicks   │ Signals │  • Stream output   │    │
│  │  • Update Logs     │         │  • Non-blocking    │    │
│  │  • Refresh Status  │         │  • Error handling  │    │
│  │                    │         │                    │    │
│  └────────────────────┘         └────────────────────┘    │
│           │                              │                 │
│           │    output_signal            │                 │
│           │◄────────────────────────────│                 │
│           │                              │                 │
│           │    finished_signal           │                 │
│           │◄────────────────────────────│                 │
│           │                              │                 │
└───────────┼──────────────────────────────┼─────────────────┘
            │                              │
            ▼                              ▼
      Update UI                     Run subprocess
```

**Benefits:**
- UI never freezes
- Real-time output streaming
- Responsive to user input
- Can cancel operations

---

## 📂 File Structure & Responsibilities

```
/app/
│
├── gui/                          # GUI Application Layer
│   ├── main.py                   # Main window, controls, status
│   ├── settings_dialog.py        # Configuration management
│   ├── run.sh                    # Launcher
│   └── build.sh                  # Executable builder
│
├── scripts/                      # Automation Layer
│   ├── start.sh                  # Service startup
│   ├── stop.sh                   # Service shutdown
│   ├── switch-php.sh             # PHP version management
│   ├── change-port.sh            # Port configuration
│   ├── backup-db.sh              # Database backup
│   └── status.sh                 # Health check
│
├── www/                          # Application Layer
│   ├── index.php                 # Your PHP application
│   └── db_test.php               # Database test
│
├── config/                       # Configuration Layer
│   └── php/
│       └── php.ini               # PHP settings
│
├── data/                         # Data Layer
│   └── mysql/                    # Persistent MySQL data
│
├── docker-compose.yml            # Orchestration Definition
└── Dockerfile                    # Container Definition
```

---

## 🔐 Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                      Host Machine                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Account (with docker group)                          │
│       │                                                     │
│       ├──► Docker Daemon (privileged)                      │
│       │        │                                            │
│       │        ├──► Container Isolation                    │
│       │        │        │                                   │
│       │        │        ├──► norex_apache (unprivileged)   │
│       │        │        │    - No host access              │
│       │        │        │    - Isolated filesystem         │
│       │        │        │    - Port mapping only           │
│       │        │        │                                   │
│       │        │        ├──► norex_mysql (unprivileged)    │
│       │        │        │    - Data in volume              │
│       │        │        │    - Network isolated            │
│       │        │        │                                   │
│       │        │        └──► norex_pma (unprivileged)      │
│       │        │             - No direct DB access         │
│       │        │             - Via MySQL network           │
│       │        │                                            │
│       │        └──► Docker Network (bridge)                │
│       │                   - Internal only                   │
│       │                   - Containers can talk             │
│       │                   - Host isolated                   │
│       │                                                     │
│       └──► Mapped Ports                                    │
│            - 8080 → Container:80 (web)                     │
│            - 8081 → Container:80 (pma)                     │
│            - 3306 → Container:3306 (mysql)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Security Features:**
- Containers run unprivileged (non-root inside)
- Network isolation (bridge network)
- No direct host filesystem access (volumes only)
- Passwords in environment (not in code)
- Port exposure controlled (explicit mapping)

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Application State                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Configuration State (docker-compose.yml)                  │
│    ├─ Port mappings                                        │
│    ├─ Environment variables                                │
│    ├─ Volume mounts                                        │
│    └─ Network configuration                                │
│                                                             │
│  Runtime State (Docker Engine)                             │
│    ├─ Container status (running/stopped)                   │
│    ├─ Health checks                                        │
│    ├─ Resource usage                                       │
│    └─ Network connectivity                                 │
│                                                             │
│  Persistent State (Volumes)                                │
│    ├─ MySQL data (./data/mysql/)                          │
│    ├─ PHP files (./www/)                                   │
│    └─ Backups (./backups/)                                 │
│                                                             │
│  GUI State (Memory)                                        │
│    ├─ Current service status                               │
│    ├─ Log buffer                                           │
│    ├─ User preferences                                     │
│    └─ Active operations                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Network Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Host Network                          │
│                    (Your Computer)                        │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Port 8080 ────┐                                         │
│  Port 8081 ────┤    Port Forwarding                      │
│  Port 3306 ────┘                                         │
│                 │                                         │
│                 ▼                                         │
│    ┌──────────────────────────────────────────┐         │
│    │      Docker Bridge Network               │         │
│    │         (norex_network)                   │         │
│    │                                          │         │
│    │  ┌─────────────┐  ┌─────────────┐      │         │
│    │  │  Container  │  │  Container  │      │         │
│    │  │  norex_apache│  │  norex_mysql │      │         │
│    │  │  IP: 172.x  │◄─┤  IP: 172.x  │      │         │
│    │  │  Port: 80   │  │  Port: 3306 │      │         │
│    │  └─────────────┘  └─────────────┘      │         │
│    │         ▲               ▲               │         │
│    │         │               │               │         │
│    │         │         ┌─────┴──────┐        │         │
│    │         │         │ Container  │        │         │
│    │         └─────────┤  norex_pma  │        │         │
│    │                   │  IP: 172.x │        │         │
│    │                   │  Port: 80  │        │         │
│    │                   └────────────┘        │         │
│    └──────────────────────────────────────────┘         │
│                                                           │
└───────────────────────────────────────────────────────────┘

External Access:
- Browser → localhost:8080 → norex_apache:80
- Browser → localhost:8081 → norex_pma:80
- MySQL Client → localhost:3306 → norex_mysql:3306

Internal Access (PHP):
- mysqli('db', ...) → norex_mysql:3306
- DNS resolution: 'db' → norex_mysql container IP
```

---

## 📊 Component Dependencies

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
       ┌────▼────┐                   ┌────▼────┐
       │   GUI   │                   │   CLI   │
       │ (PySide)│                   │ (Bash)  │
       └────┬────┘                   └────┬────┘
            │                             │
            └──────────────┬──────────────┘
                           │
                    ┌──────▼──────┐
                    │   Docker    │
                    │  Compose    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐       ┌────▼────┐      ┌────▼────┐
    │ Apache  │       │  MySQL  │      │   PMA   │
    │  + PHP  │──────►│ Database│◄─────│  Admin  │
    └─────────┘       └─────────┘      └─────────┘
         │                 │
    ┌────▼────┐       ┌────▼────┐
    │PHP Files│       │  MySQL  │
    │(Volume) │       │  Data   │
    └─────────┘       │(Volume) │
                      └─────────┘
```

**Dependency Chain:**
1. **User Interface** (GUI/CLI) → requires Docker
2. **Docker** → requires Containers defined
3. **Apache** → requires PHP, configuration
4. **PHP** → requires Extensions, php.ini
5. **MySQL** → requires Data volume
6. **phpMyAdmin** → requires MySQL connection

---

## 🎯 Critical Paths

### 1. Service Startup
```
GUI/CLI → docker compose up → Pull images (if needed) →
Create containers → Start services → Health checks →
Services ready → Status update → User notified
```

### 2. PHP Version Switch
```
User selects version → Confirmation → Update Dockerfile →
docker compose down → Rebuild image → Create new container →
Start services → Verify version → Complete
```

### 3. Settings Change
```
Open settings → Modify values → Validate → Backup file →
Write YAML → Save → User restarts → Apply changes →
Services restart → New config active
```

---

**Understanding this architecture helps you:**
- ✅ Troubleshoot issues effectively
- ✅ Customize for your needs
- ✅ Extend functionality
- ✅ Optimize performance
- ✅ Maintain security

---

*NorexProject - Powerful architecture, simple interface! 🚀*

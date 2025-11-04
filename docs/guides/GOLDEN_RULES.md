# 📜 NorexProject - Golden Rules

**Version:** 1.0  
**Last Updated:** Phase 3  
**Purpose:** Project standards untuk menjaga konsistensi, profesionalitas, dan maintainability

---

## 🎯 Core Principles

### 1. **Simplicity Over Complexity**
- ✅ Keep it simple and functional
- ✅ Don't over-engineer features
- ❌ No unnecessary abstractions
- ❌ No premature optimization

### 2. **Professional First**
- ✅ Clean, minimal design
- ✅ Consistent UI/UX
- ❌ No flashy, "forced" improvements
- ❌ No cluttered interfaces

### 3. **User-Centric Design**
- ✅ Easy to understand
- ✅ Intuitive workflows
- ✅ Clear documentation
- ❌ No hidden complexity

---

## 📁 File Organization Rules

### **Directory Structure (MUST FOLLOW)**

```
/app/
├── gui/                    # GUI application only
│   ├── main.py            # Main GUI file
│   ├── settings_dialog.py # Settings dialog
│   ├── run.sh             # GUI launcher
│   └── [no other files]   # Keep it minimal!
│
├── scripts/               # Management scripts only
│   ├── *.sh               # All bash scripts here
│   └── [no py files]      # Python scripts go elsewhere
│
├── www/                   # PHP files only
│   └── *.php              # User's PHP code
│
├── docs/                  # Documentation only
│   ├── user/              # End-user docs
│   ├── technical/         # Dev docs
│   ├── guides/            # Phase guides
│   └── meta/              # Project meta
│
├── config/                # Configuration only
│   └── php/               # PHP configs
│
├── data/                  # Persistent data only
│   └── mysql/             # MySQL data
│
├── norex.sh                # Main CLI tool (root only)
├── docker-compose.yml     # Docker config (root only)
├── Dockerfile             # Docker build (root only)
├── README.md              # Main readme (root only)
└── [Essential files]      # Only essential files in root
```

### **What Goes Where (STRICT)**

| File Type | Location | Example |
|-----------|----------|---------|
| Bash scripts | `/app/scripts/` | `start.sh`, `verify.sh` |
| Python GUI | `/app/gui/` | `main.py`, `settings_dialog.py` |
| PHP code | `/app/www/` | `index.php`, user files |
| Documentation | `/app/docs/` | Guides, references |
| Docker configs | `/app/` (root) | `docker-compose.yml`, `Dockerfile` |
| Main CLI | `/app/norex.sh` | Single entry point |

### **Root Directory (Keep Clean!)**

**✅ Allowed in Root:**
- `norex.sh` - Main CLI tool
- `docker-compose.yml` - Docker orchestration
- `Dockerfile` - Docker build
- `README.md` - Project readme
- `.env.example` - Example env file
- `.gitignore` - Git ignore
- `GETTING_STARTED.md` - Quick start guide
- Essential summary files (e.g., `PHASE_3_SUMMARY.txt`)

**❌ NOT Allowed in Root:**
- Random test files
- Temporary scripts
- Backup files (*.bak, *.old)
- IDE configs (move to .gitignore)
- Multiple CLI tools (only norex.sh!)
- Duplicate documentation

### **Documentation Organization**

```
/app/docs/
├── user/                   # For end users
│   ├── QUICK_START.md     # 5-min guide
│   ├── INSTALLATION.md    # Full install
│   ├── GUI_INSTALLATION.md
│   ├── QUICK_REFERENCE.md
│   └── USER_CHECKLIST.md
│
├── technical/              # For developers
│   ├── ARCHITECTURE.md
│   ├── CHANGELOG.md
│   └── API_REFERENCE.md (future)
│
├── guides/                 # Phase guides
│   ├── PHASE_2_COMPLETE.md
│   ├── PHASE_3_COMPLETE.md
│   └── GOLDEN_RULES.md    # This file
│
└── meta/                   # Project meta
    ├── GIT_READY.md
    ├── SETUP_SUMMARY.md
    └── PROJECT_FILES.txt
```

---

## 🎨 GUI Design Rules

### **Layout Principles**

1. **Minimal & Clean**
   - ✅ Only essential elements visible
   - ✅ White space for breathing room
   - ❌ No cluttered interface
   - ❌ No unnecessary decorations

2. **Information Hierarchy**
   - ✅ Most important info at top
   - ✅ Actions in context menu (right-click)
   - ✅ Settings in toolbar (⚙️ icon)
   - ❌ No info overload

3. **Professional Appearance**
   - ✅ Consistent colors (dark theme)
   - ✅ Proper spacing and alignment
   - ✅ Clear typography
   - ❌ No "forced" improvements
   - ❌ No flashy animations

### **GUI Component Rules**

#### **Status Indicators**
```
✅ DO:
- Simple color indicators (green/red)
- Clear tooltips
- Appropriate size (20-24px)

❌ DON'T:
- Blinking or pulsing animations
- Oversized indicators
- Too many status types
```

#### **Logs Panel**
```
✅ DO:
- Collapsible or toggleable (future)
- Reasonable default height
- Clear, readable font
- Scroll to latest entry

❌ DON'T:
- Always visible taking space
- Too small to read
- Cluttered with timestamps
- No way to hide/minimize
```

#### **Version Badge/Info**
```
✅ DO:
- Small, unobtrusive
- In about dialog or footer
- Show on demand (click/hover)

❌ DON'T:
- Always prominent display
- Taking valuable space
- Distracting placement
```

#### **Context Menu**
```
✅ DO:
- Right-click anywhere
- Logical grouping (separators)
- Clear action labels
- Essential actions only

❌ DON'T:
- Too many options (> 15)
- Nested submenus (confusing)
- Duplicate button actions
```

#### **Toolbar**
```
✅ DO:
- Minimal icons (< 5)
- Clear tooltips
- Essential actions only
- ⚙️ for settings

❌ DON'T:
- Cluttered with buttons
- Duplicate context menu
- Confusing icons
```

### **Color Scheme (Standard)**

```
Background: #1a1a2e → #16213e (gradient)
Primary:    #0f4c75
Accent:     #3282b8
Text:       #eaeaea
Success:    #00ff88
Error:      #ff4444
Warning:    #ffa500
```

**Rule:** Stick to this palette. No random colors!

---

## 💻 Code Standards

### **Python (GUI Code)**

#### **Naming Conventions**
```python
# Classes: PascalCase
class NorexProjectGUI:
    pass

# Functions/methods: snake_case
def create_status_group(self):
    pass

# Variables: snake_case
toolbar_status = "Ready"

# Constants: UPPER_SNAKE_CASE
DEFAULT_PORT = 8080
```

#### **Imports Organization**
```python
# 1. Standard library
import sys
import os

# 2. Third-party
from PySide6.QtWidgets import QWidget
from PySide6.QtCore import Qt

# 3. Local imports
from settings_dialog import SettingsDialog
```

#### **File Structure**
```python
# 1. Docstring
"""Module description"""

# 2. Imports
import ...

# 3. Constants
DEFAULT_PORT = 8080

# 4. Classes
class MainWindow:
    pass

# 5. Main execution
if __name__ == "__main__":
    main()
```

### **Bash Scripts**

#### **Script Header (REQUIRED)**
```bash
#!/bin/bash

################################################################################
# Script Name - Description
# Usage: bash script.sh [args]
################################################################################

set -e  # Exit on error
```

#### **Variable Naming**
```bash
# Constants: UPPER_SNAKE_CASE
PROJECT_ROOT="/app"
DEFAULT_PORT=8080

# Variables: snake_case
current_status="running"
container_name="norex_apache"
```

#### **Error Handling**
```bash
# Always check command success
if ! docker ps &> /dev/null; then
    echo "Error: Docker not running"
    exit 1
fi

# Use set -e at script start
set -e
```

### **Documentation**

#### **Markdown Files**
```markdown
# Title (H1 - One per file)

## Section (H2)

### Subsection (H3)

#### Details (H4 - use sparingly)

- Bullet points for lists
- Clear and concise
- Examples included

**Bold** for emphasis
*Italic* for terms
`code` for commands
```

#### **Code Comments**
```python
# Good comment - explains WHY
# Use Docker for isolation and consistency

# Bad comment - states obvious
# Set port to 8080
port = 8080
```

---

## 🔧 Feature Development Rules

### **Before Adding New Feature**

**Ask These Questions:**
1. ✅ Is it essential for core functionality?
2. ✅ Does it improve user experience significantly?
3. ✅ Is it professional and clean?
4. ✅ Is it well-documented?
5. ✅ Can it be maintained easily?

**If ANY answer is NO → Don't add it!**

### **Feature Checklist**

Before committing new feature:
- [ ] Code follows naming conventions
- [ ] Documentation updated
- [ ] No code duplication
- [ ] Error handling present
- [ ] User-friendly error messages
- [ ] Tested manually
- [ ] No breaking changes
- [ ] Performance acceptable
- [ ] Clean code (no commented-out blocks)
- [ ] Follows project structure

### **Feature Priorities**

**Priority 1 (Must Have):**
- Core functionality works
- Error handling
- Basic documentation

**Priority 2 (Should Have):**
- User experience improvements
- Better error messages
- Complete documentation

**Priority 3 (Nice to Have):**
- Advanced features
- Optimization
- Extra documentation

**Priority 4 (Future):**
- Experimental features
- Non-essential polish
- Extended guides

---

## 📝 Documentation Rules

### **Every File Needs**

1. **Purpose** - What does it do?
2. **Usage** - How to use it?
3. **Examples** - Show practical use
4. **Notes** - Important considerations

### **Documentation Standards**

```markdown
# File Title

**Purpose:** Clear one-line description

## Quick Start
[3-5 step guide]

## Usage
[Detailed instructions]

## Examples
[Real code examples]

## Troubleshooting
[Common issues and fixes]

## Related
[Links to other docs]
```

### **Documentation Locations**

| Doc Type | Location |
|----------|----------|
| User guides | `/app/docs/user/` |
| Technical docs | `/app/docs/technical/` |
| Phase summaries | `/app/docs/guides/` |
| Project meta | `/app/docs/meta/` |
| Quick reference | Root (e.g., `GETTING_STARTED.md`) |

---

## 🐛 Error Handling

### **User-Facing Errors**

```bash
# Good error message
echo "❌ Error: Docker is not running"
echo "💡 Solution: Start Docker Desktop or run 'sudo systemctl start docker'"

# Bad error message
echo "Error occurred"  # Too vague!
```

### **GUI Error Messages**

```python
# Good
QMessageBox.critical(
    self,
    "Docker Not Running",
    "Docker daemon is not running.\n\n"
    "Please start Docker Desktop or run:\n"
    "sudo systemctl start docker"
)

# Bad
QMessageBox.critical(self, "Error", "Failed")  # Too vague!
```

### **Error Logging**

```python
# Always provide context
self.log(f"❌ Failed to start services: {error}")
self.log(f"💡 Check if Docker is running")

# Not just:
self.log("Error")  # Useless!
```

---

## 🔐 Security Rules

### **Credentials**

```bash
# ❌ NEVER hardcode in code
password = "mypassword123"

# ✅ Use environment variables
password = os.environ.get('DB_PASSWORD')

# ✅ Or config files (not in git)
# Listed in .gitignore
```

### **Default Credentials**

```
Default credentials ONLY for development:
- root / 041201

⚠️ ALWAYS document:
"⚠️ Development use only! Change for production."
```

### **Docker Security**

```yaml
# ✅ Don't expose all ports
ports:
  - "8080:80"  # Specific mapping

# ❌ Don't use host network
network_mode: host  # Too permissive!
```

---

## ⚡ Performance Rules

### **Docker**

```bash
# ✅ Clean up unused resources
docker system prune

# ✅ Use specific image versions
image: python:3.11-slim  # Not 'latest'

# ❌ Don't pull large images
image: ubuntu:latest  # Too big!
```

### **GUI Performance**

```python
# ✅ Use background threads for long tasks
worker = WorkerThread(command)
worker.start()

# ❌ Don't block main thread
subprocess.run(command)  # Freezes GUI!
```

### **Resource Usage**

- Keep Docker images < 500MB
- GUI memory usage < 200MB
- Startup time < 10 seconds
- Response time < 1 second

---

## 🧪 Testing Requirements

### **Before Committing**

**Manual Tests:**
- [ ] GUI launches without errors
- [ ] All buttons/menus work
- [ ] Services start/stop correctly
- [ ] No console errors
- [ ] Documentation is accurate

**Code Quality:**
- [ ] No syntax errors
- [ ] No unused imports
- [ ] No commented code blocks
- [ ] Consistent formatting
- [ ] Clear variable names

### **Testing Commands**

```bash
# Python syntax check
python3 -m py_compile gui/main.py

# Bash syntax check
bash -n scripts/start.sh

# Verify installation
bash norex.sh verify

# Health check
bash norex.sh status
```

---

## 🚀 Release Rules

### **Before Phase Release**

1. **Code Complete**
   - [ ] All features implemented
   - [ ] No known bugs
   - [ ] Code reviewed

2. **Documentation Complete**
   - [ ] Phase guide written
   - [ ] Changelog updated
   - [ ] README updated
   - [ ] Examples provided

3. **Testing Complete**
   - [ ] Manual testing done
   - [ ] Health check passes
   - [ ] No console errors

4. **Clean Repository**
   - [ ] No temp files
   - [ ] No test files in root
   - [ ] Structure follows rules
   - [ ] Git status clean

### **Version Naming**

```
Major.Minor.Patch

Major: Breaking changes (1.x.x → 2.0.0)
Minor: New features (1.0.x → 1.1.0)
Patch: Bug fixes (1.0.0 → 1.0.1)

Phases:
Phase 1 = v1.0.0
Phase 2 = v2.0.0
Phase 3 = v3.0.0
```

---

## 🔄 Maintenance Rules

### **Regular Checks (Weekly)**

- [ ] Docker images up to date
- [ ] Dependencies up to date
- [ ] Documentation accurate
- [ ] No broken links
- [ ] Examples still work

### **Monthly Tasks**

- [ ] Review and update docs
- [ ] Clean up unused files
- [ ] Update changelog
- [ ] Backup database
- [ ] Security review

### **When Adding Dependencies**

```bash
# Python
pip install package
pip freeze > requirements.txt

# Node/Yarn
yarn add package
# package.json auto-updated

# Document new dependencies
# in INSTALLATION.md
```

---

## 📊 Metrics & Goals

### **Code Quality Metrics**

- Lines per function: < 50
- Functions per file: < 20
- Nesting depth: < 4
- Comments ratio: 10-20%

### **File Size Limits**

- Python files: < 1000 lines
- Bash scripts: < 500 lines
- Markdown docs: < 500 lines
- Config files: < 200 lines

**If exceeding limits → Split into modules!**

### **Project Goals**

1. **Simplicity:** Easy to understand
2. **Reliability:** Works consistently
3. **Performance:** Fast and responsive
4. **Maintainability:** Easy to update
5. **Documentation:** Clear and complete

---

## 🚫 Common Mistakes to Avoid

### **Code Mistakes**

❌ **Hardcoding values**
```python
url = "http://localhost:8080"  # Bad!
```
✅ **Use environment variables**
```python
url = os.environ.get('APP_URL')
```

❌ **No error handling**
```python
result = subprocess.run(command)  # Can crash!
```
✅ **Always handle errors**
```python
try:
    result = subprocess.run(command)
except Exception as e:
    log_error(f"Failed: {e}")
```

❌ **Blocking GUI thread**
```python
time.sleep(10)  # Freezes GUI!
```
✅ **Use background threads**
```python
worker = WorkerThread()
worker.start()
```

### **Documentation Mistakes**

❌ **Vague instructions**
```
"Run the script"  # Which script?
```
✅ **Clear instructions**
```
"Run: bash norex.sh start"
```

❌ **Outdated docs**
```
"Phase 2 features..."  # We're in Phase 3!
```
✅ **Keep updated**
```
"Phase 3 features..."  # Current!
```

### **Structure Mistakes**

❌ **Files in wrong place**
```
/app/test.py  # Should be in tests/
```
✅ **Follow structure**
```
/app/tests/test_main.py
```

❌ **Root directory clutter**
```
/app/temp.txt
/app/backup.sql
/app/test123.py
```
✅ **Keep root clean**
```
Only essential files!
```

---

## 💡 Best Practices Summary

### **DO's ✅**

1. ✅ Keep it simple and clean
2. ✅ Follow naming conventions
3. ✅ Document everything
4. ✅ Handle errors properly
5. ✅ Test before committing
6. ✅ Use environment variables
7. ✅ Keep files organized
8. ✅ Write clear comments
9. ✅ Use version control
10. ✅ Follow this document!

### **DON'Ts ❌**

1. ❌ Over-engineer solutions
2. ❌ Hardcode credentials
3. ❌ Ignore errors
4. ❌ Leave commented code
5. ❌ Skip documentation
6. ❌ Clutter root directory
7. ❌ Use vague names
8. ❌ Block GUI thread
9. ❌ Skip testing
10. ❌ Break conventions

---

## 🎓 Learning from Mistakes

### **Phase 3 Lessons**

**What Went Wrong:**
- GUI too "improved" → Not professional
- Version badge too prominent → Cluttered
- Logs always visible → Takes space
- Missing collapsible panels → Poor UX

**What We Learned:**
- Less is more
- Professional > Flashy
- User control is important
- Test UI with fresh eyes

**Future Improvements:**
- Collapsible log panel
- Hidden version info
- More context menu actions
- Better icon system

---

## 📚 References

### **Essential Documents**

- This file: `/app/docs/guides/GOLDEN_RULES.md`
- Architecture: `/app/docs/technical/ARCHITECTURE.md`
- Changelog: `/app/docs/technical/CHANGELOG.md`
- Quick Start: `/app/GETTING_STARTED.md`

### **External Resources**

- PySide6 Docs: https://doc.qt.io/qtforpython/
- Docker Docs: https://docs.docker.com/
- Bash Guide: https://mywiki.wooledge.org/BashGuide
- Python PEP 8: https://pep8.org/

---

## 🔄 Document Maintenance

**This document should be:**
- ✅ Updated after each phase
- ✅ Referenced before coding
- ✅ Followed strictly
- ✅ Shared with contributors

**Last Review:** Phase 3 Complete  
**Next Review:** Phase 4 Planning  
**Maintained By:** Project Lead

---

## 🎯 Final Words

> "Good code is its own best documentation. As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'" - Steve McConnell

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler

---

**Remember:** These rules exist to make development easier, not harder. Follow them, and the project will remain clean, professional, and maintainable! 🚀

---

*NorexProject Golden Rules v1.0 - Your guide to excellence!*

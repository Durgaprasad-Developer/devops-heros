# 🐚 Session 3: Shell Scripting Homework Task

**Name:** Durga Prasad  
**Enrollment Number:** 10012  
**Course:** SST DevOps & Cloud [SWE]  

---

## 📌 Overview
This shell script retrieves system metrics (date, hostname, username, disk usage), prompts the user for directory/log naming, creates the necessary folder and file, and redirects running process information into the log file.

---

## 🛠️ Commands & Concepts Used
- `date`, `hostname`, `whoami` — System information variables
- `df -h` — Human-readable disk space usage
- `read -p` — Interactive user prompt
- `mkdir -p` & `touch` — Directory and file creation
- `ps aux >` — Process listing & output redirection

---

## 📜 Shell Script (`sys_info.sh`)

```bash
#!/bin/bash

CURRENT_DATE=$(date)
HOST_NAME=$(hostname)
USER_NAME=$(whoami)

echo "==============================================="
echo "Date & Time: $CURRENT_DATE"
echo "Host name: $HOST_NAME"
echo "User name: $USER_NAME"
echo "==============================================="
echo "Disk Usage"
df -h
echo ""

read -p "Enter directory name to create: " DIR_NAME
read -p "Enter log filename to create: " FILE_NAME

mkdir -p "$DIR_NAME"
touch "$DIR_NAME/$FILE_NAME"
echo "Create directory '$DIR_NAME' and file '$FILE_NAME' ."

ps aux > "$DIR_NAME/$FILE_NAME"
echo "Successfully send running processs into $DIR_NAME/$FILE_NAME"
```

---

## 📸 Script Execution Output (Terminal Screenshot)

```
durga-prasad@durga-prasad-RedmiBook-15-Pro:~/devops-heros/session3-shell-scripting$ ./sys_info.sh 
===============================================
Date & Time: Wed Oct  7 10:13:12 PM IST 2026
Host name: durga-prasad-RedmiBook-15-Pro
User name: durga-prasad
===============================================
Disk Usage
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           773M  3.5M  770M   1% /run
/dev/nvme0n1p2  353G  326G  8.5G  98% /
tmpfs           3.8G  127M  3.7G   4% /dev/shm
tmpfs           5.0M  8.0K  5.0M   1% /run/lock
efivarfs        184K  157K   23K  88% /sys/firmware/efi/efivars
/dev/nvme0n1p1  1.1G   33M  1.1G   4% /boot/efi
tmpfs           773M  120K  773M   1% /run/user/1000

Enter directory name to create: dp
Enter log filename to create: dpdo
Create directory 'dp' and file 'dpdo' .
Successfully send running processs into dp/dpdo
```

---

## 📁 What the Script Creates

| Item | Type | Description |
|---|---|---|
| `dp/` | Directory | Created by `mkdir -p dp` |
| `dp/dpdo` | File | Created by `touch dp/dpdo` |
| `dp/dpdo` contents | Process list | Written by `ps aux > dp/dpdo` |

---

## 🔑 Key Concepts Demonstrated

| Concept | Command Used | Purpose |
|---|---|---|
| Variables | `CURRENT_DATE=$(date)` | Store command output |
| System info | `hostname`, `whoami` | Get host and user |
| Disk usage | `df -h` | Human-readable disk stats |
| User input | `read -p "..."` | Prompt for interactive input |
| Directory creation | `mkdir -p` | Create nested directories |
| File creation | `touch` | Create empty file |
| Process listing | `ps aux` | Show all running processes |
| Output redirection | `> file` | Write stdout to a file |

---

## 🔗 GitHub Repository

This script is pushed to the public repository:  
👉 [github.com/Durgaprasad-Developer/devops-heros](https://github.com/Durgaprasad-Developer/devops-heros)
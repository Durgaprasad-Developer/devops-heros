# 🐚 Session 3: Shell Scripting Homework Task

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


durga-prasad@durga-prasad-RedmiBook-15-Pro:~/devops-heros/session3-shell-scripting$ ./sys_info.sh 
===============================================
Date & Time: Wed Sep  2 06:21:32 PM IST 2026
Host name: durga-prasad-RedmiBook-15-Pro
User name: durga-prasad
===============================================
Disk Usage
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           773M  3.5M  770M   1% /run
/dev/nvme0n1p2  353G  308G   27G  92% /
tmpfs           3.8G  343M  3.5G   9% /dev/shm
tmpfs           5.0M  8.0K  5.0M   1% /run/lock
efivarfs        184K  156K   24K  88% /sys/firmware/efi/efivars
/dev/nvme0n1p1  1.1G   33M  1.1G   4% /boot/efi
tmpfs           773M  120K  773M   1% /run/user/1000

Enter directory name to create: dp
Enter log filename to create: dpdo
Create directory 'dp' and file 'dpdo' .
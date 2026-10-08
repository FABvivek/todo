# AWS Free Tier Deployment Guide: Spring Boot + React + MySQL

This guide walks you step-by-step through deploying your full-stack Todo application onto an **AWS EC2 Free Tier** instance (`t2.micro` or `t3.micro`) using Docker Compose.

---

## 1. AWS Free Tier Overview & Prerequisites

Under the AWS 12-Month Free Tier, you get:
- **750 hours/month** of Linux `t2.micro` (or `t3.micro` in regions that support it). Running 1 instance 24/7 uses 720–744 hours, which is **100% Free**.
- **30 GB** of EBS SSD storage (gp2 or gp3).
- **100 GB** free data transfer out per month.

### Key Tip for 1GB RAM Instances:
`t2.micro` and `t3.micro` have **1 GB of RAM**. Running Java 21 + MySQL + Nginx in 1GB RAM can occasionally cause Linux OOM (Out Of Memory) killer to trigger during Maven/Docker builds unless you configure a **Swap File**. We have included simple instructions below to enable 2 GB of swap memory on your instance.

---

## 2. Launching Your EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **EC2** > **Instances** > click **Launch Instances**.
3. **Name**: `todo-app-server`
4. **Application and OS Images (Amazon Machine Image)**:
   - Select **Ubuntu Server 24.04 LTS** (Free tier eligible) or **Amazon Linux 2023**.
5. **Instance Type**:
   - Select `t2.micro` (or `t3.micro`).
6. **Key Pair (login)**:
   - Click **Create new key pair**.
   - Name: `todo-ec2-key`.
   - Private key file format: `.pem` (for OpenSSH).
   - Save the downloaded file securely (e.g. `~/.ssh/todo-ec2-key.pem`).
7. **Network Settings (Firewall / Security Group)**:
   - Select **Create security group**.
   - Check **Allow SSH traffic from** (`Anywhere 0.0.0.0/0` or `My IP`).
   - Check **Allow HTTP traffic from the internet** (`0.0.0.0/0`, Port 80).
   - Check **Allow HTTPS traffic from the internet** (`0.0.0.0/0`, Port 443).
8. **Configure Storage**:
   - Default is `8 GiB` or `16 GiB` gp3 (Keep within 30 GiB to stay free tier). 20 GiB gp3 is recommended.
9. Click **Launch Instance**.

---

## 3. Connect to Your EC2 Instance

Open PowerShell or Terminal on your local machine:

```bash
# Set permissions on the key file (Linux/Mac/WSL)
chmod 400 todo-ec2-key.pem

# SSH into your EC2 instance (replace with your EC2 Public IPv4 DNS or IP)
ssh -i "todo-ec2-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

*(If you chose Amazon Linux, the username is `ec2-user@<YOUR-EC2-PUBLIC-IP>`)*

---

## 4. Setup 2 GB Swap Memory (Crucial for 1GB RAM)

Run these commands on the server to prevent memory bottlenecks:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap persistent on reboot:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify memory:
free -h
```

---

## 5. Install Docker & Docker Compose on Ubuntu

Run the following commands on your EC2 instance:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker & Git
sudo apt install -y git docker.io docker-compose-v2

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Allow ubuntu user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## 6. Deploy the Application

### Option A: Clone from your GitHub repository (Recommended)
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git todo-app
cd todo-app
```

### Option B: Upload files directly via SCP
From your local Windows terminal:
```powershell
scp -i "C:\path\to\todo-ec2-key.pem" -r "C:\Users\vivek\.gemini\antigravity-ide\scratch\todo-app" ubuntu@<YOUR-EC2-PUBLIC-IP>:~/todo-app
```
Then on the EC2 instance:
```bash
cd ~/todo-app
```

---

## 7. Start the Containers

Inside the project directory on EC2, run:

```bash
docker compose up -d --build
```

Docker will:
1. Start the MySQL 8.0 container and wait for its healthcheck.
2. Build the Java 21 Spring Boot backend and start it on port 8080.
3. Build the React frontend with Vite and serve it via Nginx on port 80.

### Check Container Status:
```bash
docker compose ps
docker compose logs -f backend
```

---

## 8. Test Your Live Application!

Open your web browser and navigate to:
```text
http://<YOUR-EC2-PUBLIC-IP>
```

- You will see the **TaskFlow** React UI!
- The top badge will show **Spring Boot API Online** with a green pulse dot.
- You can create, toggle, edit, search, filter, and delete tasks directly backed by MySQL.

---

## 9. Useful Maintenance Commands

```bash
# View all container logs
docker compose logs -f

# View only backend logs
docker compose logs -f backend

# Stop all containers
docker compose down

# Restart containers
docker compose restart

# Rebuild after code updates
git pull
docker compose up -d --build
```

---

## 10. Stay 100% Free on AWS

1. **Only run 1 EC2 instance** at a time under `t2.micro` or `t3.micro`.
2. Keep total EBS volume sizes under **30 GB**.
3. **Set up AWS Budget Alert**:
   - In AWS Console, search **AWS Budgets**.
   - Create a budget for `$0.01` with email notifications to alert you before any charges occur.

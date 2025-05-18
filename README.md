
# 📱 Android Phone Server - Student Attendance System

> **Demonstration project** using Termux, Debian container, Node.js, NGINX, MariaDB, and ngrok on an Android smartphone remote server.

---

![Termux Logo](https://camo.githubusercontent.com/ed6580a7bf0b175cd414ba663b9fbb797eb55c7dd12553a6ffff562d92664558/68747470733a2f2f692e696d6775722e636f6d2f384975594c526c2e6a7067)

---

## 🛠️ Setting up Termux and Debian Container

```bash
--Download the Termux app from the Play Store or from GitHub
--Open the Termux app in your smartphone 

--Installing proot-distro in Termux
     pkg install proot-distro

--Installing Debian in Termux 
     proot-distro install debian

--Login to go inside the Debian container
     proot-distro login debian

---Inside the Debian container 
    whoami 
    output will be root 

    passwd 
    now set the password for the root and remember it
```

---

## 🔐 INSTALLING OPENSSH-SERVER FOR SSH LOCAL COMMUNICATION

![SSH Icon](https://cdn-icons-png.flaticon.com/128/5225/5225647.png)

```bash
Iside the Debian container install the openssh server
  apt install openssh-server

Now configure the file to set the port to non-privileged port
  nano /etc/ssh/sshd_config
```

Update the following in the config:

```
Port 22 ---> Port <non privileged port like 2200>
ListenAddress 0.0.0.0 
ListenAddress ::
PermitRootLogin yes
PasswordAuthentication yes
```

> Save: `Ctrl + O`, `Enter`, `Ctrl + X`

```bash
Check if SSH is running:
  ps aux | grep sshd 

Generate SSH keys:
  ssh-keygen -A

Start the SSH service:
  service ssh start
```

### 🔗 Connect from another device on the same LAN:

```bash
ssh root@<IP address of your server device> -p <your port>
```

---

## 🌐 INSTALLING NGINX

![NGINX](https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg)

```bash
1. apt install nginx -y

2. Configure the server:
   nano /etc/nginx/sites-available/default

3. Create a symlink:
   ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

### 🛠️ Options:If it has already symlink then following procedure

* **Remove and recreate symlink**:

  ```bash
  rm /etc/nginx/sites-enabled/default
  ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
  ```

* **Verify symlink**:

  ```bash
  ls -l shows the symlink points to /etc/nginx/sites-available/default
  cat /etc/nginx/sites-available/default
  ```

### ✅ Verify and run NGINX:

```bash
nginx -t
output will look like nginx:the configuration file /etc/nginx/nginx.conf syntax is OK
                      nginx:configuration file /etc/nginx/nginx.conf test is successful
/usr/sbin/nginx       for running the nginx
killall -HUP nginx    for reloading the nginx (applying the changes)
ps aux | grep nginx   for cheching nginx is running or not
                      if is running then you will see master and worker otherwise not
```

### 🧪 Create a static test file:

```bash
mkdir -p /var/wwww/html/test
echo "<h1>TEST PAGE</h1>" > /var/www/html/test/index.html
chown -R www-data:www-data /var/www/html
```

### 🔍 Test NGINX:

```bash
curl http://127.0.0.1:<your set port >/test/
The orutput will be
TEST PAGE
SO this confirms Nginx is serving your configuration correctly
```

---

## 🔧 BACKEND (Node.js)

![Node.js Logo](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg)

```bash
1. mkdir ~/myapp
2. cd ~/myapp
3. npm init -y
4. npm inatall express mysql2 cors

5. nano ~/myapp/server.js 
   # Write your backend code

6. node ~/myapp/server.js &
```

---

## 🎨 FRONTEND

### 📄 index.html

```bash
nano /var/www/html/test/index.html
```

### 🎨 styles.css

```bash
nano /var/www/html/test/styles.css
```

### 💻 script.js

```bash
nano /var/www/html/test/script.js
```

> Save: `Ctrl + O`, `Enter`, `Ctrl + X`

### ✔️ Verify backend:

```bash
ps aux | grep node
```

---

## 🗄️ DATABASE (MariaDB)

![MariaDB Logo](https://mariadb.com/wp-content/uploads/2019/11/mariadb-horizontal-blue.svg)

```bash
1. apt install mariadb-server
2. mysqld_safe &

3. mysql -u root -p
```

### Inside MySQL:

```sql
CREATE DATABASE attendance_db;
CREATE 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
GRANT ALL ON attendance_db.*TO 'appuser'@'localhost';
USE attendance_db;

CREATE TABLE students(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE attendance(
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  date DATE,
  status ENUM('present','absent'),
  FOREIGN KEY(student_id) REFERENCES student(id)
);

INSERT INTO students (name) VALUES ('Alice'),('Bob');
EXIT;
```

---

## 🌍 INSTALLING NGROK

![ngrok Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlxxip8cVxG7VRcFHNIU13E5d6RxtZbnhnFw&s)
```bash
1. apt update
2. apt install wget unzip

3. wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
4. tar -xzvf ngrok-v3-stable-linux-arm64.tgz
5. mv ngrok /usr/local/bin/
6. chmod +x /usr/local/bin/ngrok
```

### 🧾 Authenticate ngrok:

```bash
ngrok authtoken <your authtoken from ngrok.com>
```

### 🚀 Launch:

```bash
ngrok http <your port set by you>
```

---

## ✅ FINAL CHECKLIST

Ensure the following services are **running**:

* [x] MySQL
* [x] NGINX
* [x] Node.js Backend
* [x] ngrok

Then visit:

```
<Your ngrok URL>/test/
```

✅ You’ll see your frontend live!

---

> 🎓 This system demonstrates how a **mobile phone can run a full web server** stack, perfect for learning, demos, and quick prototyping.


# android-phone-server
#making a simple student attendance system for demonstration of mentioned mobile server
using container debian inside termux setup remote server
--Download the temux app from the play store or from the git hub
--Open the termux app in your smart phone 
--installing proot-distro in the termux
     pkg install proot-distro
--installing the debian in the termux 
     proot-distro install debian
--After installing you have to login to go inside the debian container
     proot-distro login debian
---inside the debian container 
    whoami 
    output will be root 
    passwd 
    now set the password for the root and remember it
    
INSTALLING OPENSSH-SERVER FOR SSH LOCAL COMMUNICATION
-------------------------------------------------------
Iside the debian container install the openssh server
  apt install openssh-server
Now configure the file to set the port to non priviledge port
  nano /etc/ssh/sshd_config
  after pressing enter look for following and amend / change it or uncomment it
    Port 22 ---to ---> Port <non priviledge port like 2200>
    ListenAddress 0.0.0.0 
    ListenAddress ::
    PermitRootLogin yes
    PasswordAuthentication yes
    After editing using the editor nano press ctrl + 0 then ENTER and then ctrl + x
  Now check ssh is running or not
    ps aux | grep sshd          and look for /usr/sbin/sshd in the output if it does then it is running else not 
    ssh-keygen -A
    if the ssh is not running the we have to run it right
    service ssh start            for starting the ssh 
    service ssh stop             for stopping it
    service ssh status           for knowing the status that is it is running or not 
  NOW GO TO ANOTHER DEVICE USING SAME LAN THAT IS CONNECTED TO SAME NETWORK
    In the terminal 
    ssh root@< IP address of your server your device> -p <port you set>     and then a prompt wil appeat for password type your root password you used bdfore also it will ask for key yes or no type yes
    NOW YOU GOT THE ACCESS TO OPERATE FROM YOU LAPTOP OF THE DEBIAN CONTAINER
    ADVANTAGE OF IT IS NOW YOU CAN EASILY COPY PASTE THE CODE AND ETC 

LETS Install NGINX inside the container
  1. apt install nginx -y
  2. set the configuration for the server side like the port and proxies etc code is provided just copy and paste you can edit it though as per your requirements
     nano /etc/nginx/sites-available/default
  3. After editing you have to create a symlink to do that
     ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
     output wil be like lrwxrwxrwx 1 root root default -> /etc/nginx/sites-available/default
     ls -l /etc/nginx/sites-enabled/         this will tell the there is existing symlink or not
     Option (1) Remove and Recreate symlink if it already exists
         rm /etc/nginx/sites-enabled/default
         ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
     Option(2) Verify the existing symlink
         ls -l shows the symlink points to  /etc/nginx/sites-available/default
         cat /etc/nginx/sites-available/default
 4.Verify nginx configuration
     nginx -t
     output will be like nginx:the configuration file ---------------syntax OK
                         nginx:----------------------------------test is successful
     check nginx is running or not to do that
     ps aux | grep nginx
     the output will have something like master  and workers if you see it it running if not then it not running
     
     TO RUN NGINX following command
     /usr/sbin/nginx
     Change or reload(apply changes)
     killall -HUP nginx
5.CREATE A STATIC FILE FOR TESTING
     your config serves /test/ from /var/wwww/html/test/
     mkdir -p /var/wwww/html/test
     echo "<h1>TEST PAGE</h1>" > /var/www/html/test/index.html
     chown -R www-data:www-data /var/www/html

6.TEST NGINX LOCALLY INSIDE THE DEBIAN CONTIANER
    curl http://127.0.0.1:<your set port >/test/
    output will be <h1>TEST PAGE</h1>    this confims nginx is serving your configration correctly
------------------------------------------------------------------------------------
NOW CREATE A BACKEND (Nodejs)
----------------------------------------------------------------------------------
1.mkdir ~/myapp
2.cd ~/myapp
3.npm init -y
4.npm inatall express mysql2 cors

CREATE server.js
6.nano  ~/myapp/server.js 
    In it copy paste the code or write your own backend code
START BACKEND
7.node ~/myapp/server/js &
CREATE FRONTEND
HTML(index.html)
8.nano /var/www/html/test/index.html
  In it write the html code or copy paste or according to your use
9.nano /var/www/html/test/styles.css
  write the css code in here
10.nano /var/www/html/test/script.js
  write the javascript code

  for saving them each of them ctrl+o then enter and then ctrl+x
YOU CAN CHECH BACKEND IS RUNNING OR NOT BY    ps aux | grep node

___________________________________________________________________________________________
NOW THE DATABASE CREATION IN MARIADB
_______________________________________________________________________________________
1.apt install mariadb-server           installing mariadb server
2.mysqld_safe &                        running mariadb server
3.mysql -u root -p                     login in the mariadb and enter the root password used by you
4.CREATE YOUR DATABASE HERE FOR EXAMPLE
  CREATE DATABASE attendance_db;
  CREATE 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
  GRANT ALL ON attendance_db.*TO 'appuser'@'localhost';
  USE attendance_db;
  CREATE TABLE students(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL);
  CREATE TABLE attendance(id INT AUTO_INCREMENT PRIMARY KEY,student_id INT, date DATE,status ENUM('present','absent'),FOREIGN KEY(student_id) REFERENCES student(id));
  INSERT INTO students (name) VALUES ('Alice'),('Bob');
  EXIT;
_________________________________________________________________________________________
INSTALLING NGROK FOR CONNECTING TO ALL NETWORKS
_________________________________________________________________________________________
Inside the debian container 
1.apt update
2.apt isntall wget unzip
3.wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz
4.tar -xzvf ngrok-v3-stable-linux-arm64.tgz
5.mv ngrok /usr/local/bin/
6.chmod +x /usr/local/bin/ngrok
7.You have to sign up for free ngrok account @ngrok.com 
  you get an "your authtoken" in the dashboard of ngrok website after login copy that
8.ngrok authtoken <your authtoken must be pasted here>
9.ngrok http <your port set by you >      a link will be provided to you copy that 
____________________________________________________________________________________________
ensure mysql ,nginx,ngrok,and the backend is running check it first if not running the run it
then use copy the ngrok link provided followed by /test/ in above code used frontend written there
  


# Clustera
This repository contains the web application called Clustera which is my Special Problem Project for CMSC 190

# Instruction for deploying the backend on an Amazon EC2 instance (Amazon Web Services)

Watch this video as reference if you are having trouble accessing the backend or running it: 
- How to Deploy Django Application on AWS EC2 | Nginx | Gunicorn | WSGI | Supervisor |HTTPS Request: https://www.youtube.com/watch?v=vmMyuZSHt3c

### 1. Create an Amazon Web Service account and then create an EC2. Optional but you can also create an elastic IP and bind it your EC2 instance.    
### 2. Run the EC2 instance and run this following commands.
```bash
sudo apt-get update
sudo apt install python3-pip -y
git config --global user.name "Your Github username"
git config --global user.email "Your Github email"
git clone https://"MY_PERSONAL_ACCESS_TOKEN"@github.com/amtw123456/Clustera.git
```
Running these commands will configure the ec2 instance to allow you clone the repository and as well as install python3 which allows you to run python related commands.
### 3. Install python venv to create a virtual environment on top of your backend/django server to have an environment for your packages
```bash
sudo apt-get install -y python3-venv
```
### 4. Create a python virtual environment for the django backend server and access it go to the root directory where the Clustera repository is located
```bash
python3 -m venv env
source env/bin/activate
```
### 5. find your ec2 instance public IP domain name or if an elastic IP is attached to your ec2 instance use that. Once you find your IP attach that to your domain. In my case I used https://freedns.afraid.org/ to create a domain name since an SSL needs a domain name to be activated
You can use any domain name that you own. This step is crucial to create your own SSL secured backend server. I need an SSL secure website since vercel only accepts api calls from an SSL secured website.
### 6. Once you have cloned the repository and have created a virtual environment and activated that environment, navigate to the backend folder of the repository and run these commands.
```bash
cd Clustera/backend
pip install django-cors-headers
pip install -r requirements.txt
```
Installing these python packages would allow users to run the Clustera backend server. Without installing these python packages the backend server will have prompt an error if you try to run it. Note that there might be errors that you might encounter. when trying to run the server such as packages error. This could be fixed by downgrading that specific packages version. Here is one error I encountered.

ImportError: cannot import name 'triu' from 'scipy.linalg' - Gensim: https://stackoverflow.com/questions/78279136/importerror-cannot-import-name-triu-from-scipy-linalg-gensim

### 7. Once you have succesfully ran your django backend server where it showed that you can access the django app at port 127.0.0.1:8000/. The next step we do is we download nginx
```bash
sudo apt-get install nginx
```
To verify if the nginx server is working we can check the IP public address on a web browser and if it show nginx then nginx has been successfully downloaded on your ec2 instance. If not you need to go ec2 security details and modify the inbound rules
and edit the rules to allow http and https access from anywhere.
### 8. Once you have succesfully installed nginx you can now access your IP address and it will show a "Welcome to nginx" stattic page. 
```bash
"your public IP address or your linked domain name"
```
If you are unable to access the domain address either you have wrongly edited the inbound rules or somewhere a long the setup process watch the youtube video links above and follow that along.
### 9. The next step is to download gunicorn which is a Python WSGI (Web Server Gateway Interface) HTTP server for UNIX-like operating systems. It's commonly used to deploy Python web applications
```bash
"pip install gunicorn"
```
### 10. The next step is to bind our django application to gunicorn. You must be in the directory of the backend server
```bash
gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
```
Once you have used gunicorn to bind the application. You can check if you can access the django application on the domain of your app or IP of your app
```bash
"your EC2 public IP address or your linked domain name":8000
```
When an error occurs where it says host is not allowed to access this website
Just go to your settings.py and add to allowed host your IP EC2 IP address and domain name and then save.
```bash
ALLOWED_HOST = ['your EC2 public IP address','your linked domain name']
```
### 10. To make the django application run in a permanently running state even if the EC2 instance is closed meaning that you are not connected to it. We will use supervisor a python package.
```bash
sudo apt-get install supervisor
cd /etc/supervisor/conf.d/
```
Once you have changed your directory we will create a file called gunicorn.conf and we will edit it
```bash
sudo touch gunicorn.conf
sudo nano gunicorn.conf
```
Once you have opened your gunicorn.conf add this code to it
```bash
[program:gunicorn]
directory = /home/ubuntu/Clustera/backend
command = /home/ubuntu.env/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/Clustera/backend/app.sock backend.wsgi:application
autostart = true
autorrestart = true
stderr_logfile= /var/log/gunicorn/gunicorn.err.log
stdout_logfile= /var/log/gunicorn/gunicorn.out.log
[group:guni]
programs:gunicorn
```
Save and run this command next
```bash
sudo mkdir /var/log/gunicorn
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```
If you have succesfully ran gunicorn it will something like this
```bash
guni:gunicorn          RUNNING   pid 5627, uptime 0:00:04
```
If not you could view the error logs at and debug from there
```bash
cd /var/log/gunicorn
sudo nano touch gunicorn.err.log
``` 
### 11. To access the website with either the IP or domain name without :8000 we first need to modify the default file of nginx. To do that we go to the nginx directory
```bash
cd /etc/nginx/sites-available
sudo nano default
```
Once you are editing the default nginx file add this to the server_name and location line:
```bash
server_name _; ---> server_name "Your EC2 IP address", "Domain name where EC2 IP address is attached";

location / {
    include proxy_params;
    proxy_pass http://unix:/home/ubuntu/Clustera/backend/app.sock;
}
```
If you are getting a 502 error when trying to access the ec2 ip address and domain name run this command on your EC2 Ubuntu terminal
```bash
sudo chgrp -R www-data /home/*
```
The problem is that nginx is trying to run the socket, but doesn't have access to your home directory folder. If might have access to the file, but not all the directories to that file.

### 12. Now that we can access our domain without using port :8000. We now add an SSL certificate to make it an https which will finally allow our website deployed on vercel to accept https
```bash
sudo apt-add-repository -r ppa:certbot/certbot
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d clustera.1337.cx / sudo certbot --nginx -d "your domain"
```
Once you have agreed with everything your domain name will finally be SSL secure

### Extra the default accepted payload size of a nginx server is 2MB to increase that follow the steps in this stackoverflow link: https://stackoverflow.com/questions/44741514/nginx-error-client-intended-to-send-too-large-body

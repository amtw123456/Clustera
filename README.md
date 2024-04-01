# Clustera
This repository contains the web application called Clustera which is my Special Problem Project for CMSC 190


# Instruction for deploying the backend on an Amazon EC2 instance (Amazon Web Services)

Watch this video as reference if you are having trouble accessing the backend or running it: 
- Deploy a Django web app on Amazon EC2
: https://www.youtube.com/watch?v=uiPSnrE6uWE&t=334s 
- EC2 Instance Connect is unable to connect to your instance: https://www.youtube.com/watch?v=rJ3ioVwisD4 


### 1. Create an Amazon Web Service account and then create an EC2.     
### 2. Run the EC2 instance and run this following commands.
```bash
sudo apt-get update
sudo apt install python3-pip -y
git config --global user.name "Your Github username"
git config --global user.email "Your Github email"
git clone https://"MY_PERSONAL_ACCESS_TOKEN"@github.com/amtw123456/Clustera.git
```
Running these commands will configure the ec2 instance to allow you clone the repository and as well as install python3 which allows you to run python related commands.
### 3. Once you have cloned the repository, navigate to the backend folder of the repository and run these commands.
```bash
cd Clustera/backend
pip install django-cors-headers
pip install -r requirements.txt
```
Installing these python packages would allow users to run the Clustera backend server. Without installing these python packages the backend server will have prompt an error if you try to run it.
### 4. Once you have installed the packages and are in the directory of the Clusteras backend folder you can run the backend service by running this django python command. 
```bash
python3 manage.py runserver 0.0.0.0:8000
```
To acccess the backend server find the Public "IPv4 address" on your EC2 instance and add :8000 (change the IPv4 address with the EC2 public address)

Although you can run it normally by just using "python3 manage.py runserver" we wouldn't have a way to access it since we still need to modify the inbound rules. Refer to the reference video of "Deploy a Django web app on Amazon EC2" at the timestamp of 18:00.
```bash
Sample EC2 URL link: IPv4 address:8000
Sample EC2 URL link: http://3.27.253.206:8000/
```

Note: The backend service is actually running as a foreground application of the Amazon EC2 instance which means that when we close the terminal tab of the EC2 instance we would also close the backend server.
### 5. Once you have modified the inbound rules of the EC2 instance. Run the django backend application as background program in the EC2 instance.
```bash
nohup python3 manage.py runserver 0.0.0.0:8000
```
This would allow you to permanently run the django backend application server which means even that we have closed the Amazon EC2 terminal we would still be able to have a means to access it.

### 6. Closing the Django backend application that is running as an Ubuntu background process.
```bash
ps aux | grep 'python3 manage.py runserver'
kill PID
```
To determine the PID of the django application that is running as a background program type in the second value of the column we found when we displayed the process when we ran "ps aux | grep 'python3 manage.py runserver'"

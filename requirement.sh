#!/bin/bash
sudo mkdir -p /home/ec2-user/taskmaster/
sudo cp -rf /app/backend/backend/* /home/ec2-user/taskmaster/
cd /home/ec2-user/taskmaster/
sudo docker cp taskmasterDb_backup.dump postgresql:/var/lib/postgresql/data/taskmasterDb_backup.dump
sudo docker exec -it postgresql createdb -U postgres -h localhost -p 5432 taskmaster
sudo docker exec -it postgresql pg_restore -U postgres -h localhost -p 5432 -F c -v -d taskmaster /var/lib/postgresql/data/taskmasterDb_backup.dump
sudo apt update
sudo apt install python3-pip -y
sudo pip3 install -r requirements.txt
sudo python3 manage.py makemigrations
sudo python3 manage.py migrate
pkill -f runserver
sudo python3 manage.py runserver 0.0.0.0:8000 &
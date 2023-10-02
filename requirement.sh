#! /bin/bash
sudo mkdir -p /home/ec2-user/taskmaster
sudo cp -Rf /app/backend /home/ec2-user/taskmaster
cd /home/ec2-user/taskmaster
docker rm -f postgresql
docker run -d --name postgresql -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/ -p 5432:5432 postgres
docker cp taskmasterDb_backup.dump postgresql:/var/lib/postgresql/data/taskmasterDb_backup.dump
docker exec -it postgresql createdb -U postgres -h localhost -p 5432 taskmaster
docker exec -it postgresql pg_restore -U postgres -h localhost -p 5432 -F c -v -d taskmaster /var/lib/postgresql/data/railmanDb_backup.dump
sudo yum install python3-pip -y
sudo pip install -r requirements.txt
sudo python3 manage.py makemigrations
sudo python3 manage.py migrate
pkill -f runserver
sudo python3 manage.py runserver 0.0.0.0:8000 &
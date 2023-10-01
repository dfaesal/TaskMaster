# TaskMaster App
<p>&nbsp;</p>
    <h2>
        Building a full-stack Task Management App
    </h2>
    <p>
        Task management applications are great tools to organize tasks, manage projects, and stay on top of deadlines.
    </p>

## Table of contents

<!-- toc -->
- [Pre requisites](#pre-requisites)
- [Getting started](#getting-started)
<!-- tocstop -->

## Pre requisites

Create backend DB

```bash
cd "TaskMaster\"
createdb -U postgres -h localhost -p 5432 taskmaster
```

Restore data to taskmaster DB

```bash
# set your postgresql path in export
set PATH=%PATH%;C:\Program Files\PostgreSQL\15\bin
pg_restore -U postgres -h localhost -p 5432 -F c -v -d taskmaster backend\taskmasterDb_backup.dump
```

## Getting started

### Install taskmaster frontend

```bash
cd "frontend"
npm install
```

Start the React frontend

```bash
npm start
```

### Intall taskmaster backend

```bash
cd "backend"
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```

Start the Django backend

```bash
python manage.py runserver
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


![note](https://img.shields.io/badge/NOTE-important-yellow)  **_Project is not done yet!!!_**

# How to download and run

1. Install docker on your platform.
2. Clone this repo to your machine
3. Сreate a .env file inside the project. 
<img width="251" height="299" alt="image" src="https://github.com/user-attachments/assets/be36f9ec-3497-41d5-8274-64848ca3b569" />

5. Text me, i'll send you variables that you need to put inside .env file.
6. Go to the project folder in your terminal.
7. Run "docker compose up".
<img width="1083" height="23" alt="image" src="https://github.com/user-attachments/assets/d8e3599a-c796-4185-99b6-dfb0fb393d47" />

# Collecting logs

Here are some useful commands to inspect logs of your services:

> 💡 **Tip:** Use these commands from the root directory of your project where the `docker-compose.yml` file is located.

### View all container logs

```bash
docker-compose logs
```

### View logs in real-time

```bash
docker-compose logs -f
```

### View only the last 50 lines

```bash
docker-compose logs --tail=50
```

### View logs of a specific service

```bash
docker-compose logs web
```

### View logs filtered by time

```bash
docker-compose logs --since 1h
```

> ⚠️ **Note:** Replace `web` with the name of the service you want to inspect.


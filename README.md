# JSwebAppFullstack
JavaScript Fullstack WEB App: Nextjs &amp; Docker


JavaScript Fullstack WEB App: Nextjs & Docker
#
webdev
#
javascript
#
beginners
#
tutorial
By the end of this article, you will understand and create a simple yet complete full stack app using the following:

Next.js 14 (TypeScript)
Tailwind CSS
Node.js
Express (JavaScript)
Prisma
PostgreSQL
Docker
Docker Compose
There are MANY technologies, but we'll keep the example as basic as possible to make it understandable.

We will proceed with a bottom-up approach, starting with the database and ending with the frontend.

If you prefer a video version

All the code is available for free on GitHub (link in video description).

Architecture
Before we start, here is a simple schema explaining the app's architecture.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

The frontend is a Next.js app with TypeScript and Tailwind CSS. The backend is a Node.js app, with Express and Prisma as ORM. The database is PostgreSQL. We will use Docker to run the database, the backend, and also the frontend (you can also use Vercel). We will use Docker Compose to run the frontend, the backend, and the database together.

Prerequisites
Basic knowledge of what is a frontend, a backend, an API, and a database
Docker installed on your machine
Node.js installed on your machine
(optional) Postman or any other tool to make HTTP requests
1. Preparation
Create any folder you want, and then open it with your favorite code editor.
mkdir <YOUR_FOLDER>
cd <YOUR_FOLDER>
code .
Initialize a git repository.
git init
touch .gitignore
Populate the .gitignore file with the following content:
*node_modules
Create a file called compose.yaml in the project's root.
touch compose.yaml
Your projects should look like this:

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

We are ready to create the fullstack app and build it from the bottom up, starting with the database.

After each step, we will test the app's current state to ensure that everything is working as expected.

2. Database
We will use Postgres but not install it on our machine. Instead, we will use Docker to run it in a container. This way, we can easily start and stop the database without installing it on our machine.

Open the file compose.yaml and add the following content:
version: '3.9'

services:
  db:
    container_name: db
    image: postgres:12
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - 5432:5432
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata: {}

then type in your terminal
docker compose up -d
This will pull the Postgres image from Docker Hub and start the container. The -d flag means that the container will run in detached mode so we can continue to use the terminal.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Check if the container is running:
docker ps -a
Step into the db container
docker exec -it db psql -U postgres
Now that you are in the Postgres container, you can type:
\l
\dt
And you should see no relations.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

You can now exit the container with the exit command.

3. Backend
The first step is done. Now, we will create the backend. We will use Node.js and Express. We will also use Prisma to interact with the database.

Create a folder called backend at the root of the project.
mkdir backend
Then open the folder in your terminal and initialize a Node.js project:
cd backend
npm init -y
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Install the dependencies:

express: to create the server
prisma: to interact with the database
@prisma/client: to generate the code to interact with the database
npm i express prisma @prisma/client
Initialize the prisma project:
npx prisma init
This initializes the prism project. We will use Prisma to interact with the database. Prisma will generate the code to interact with the database, so we don't have to write it ourselves.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Open the file called .env and replace the content with the following:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
As a model for our project, we will use a 'User' with an id, a name, and an email. The id will be an autoincrementing integer, the name will be a string, and the email will also be a string.

Open the file /prisma/schema.prisma and replace the content with the following:
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//User with id as int autoincrement, name as string, email as string
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String
}
The file schema.prisma file should look like this:

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Now create a file called index.js inside the /backend folder and add the following content:
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

//use json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//test api with error handling
app.get('/test', (req, res, next) => {
  try {
    res.status(200).json({ message: 'Success!' });
  } catch (err) {
    next(err);
  }
});

//get all users
app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

//get user by id
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//create user
app.post('/users', async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: { ...req.body },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

//update user
app.put('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//delete user
app.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

//Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
For an explanation, check here

Now you can generate the Prisma schema
npx prisma generate
Before we dockerize the backend, let's test it. Type in your terminal:
node index.js
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Open your browser and go to http://localhost:4000/test. You should see the message Success!.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

But if we go on localhost:4000/users, we actually see an error! This is because we don't have the schema in our database yet

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

We can proceed with the dockerization part, and we will solve this problem later.

Dockerize the backend
Let's create 2 files, called .dockerignore and backend.dockerfile in the backend folder.

Open the file .dockerignore and add the following content:
**/node_modules
Open the file backend.dockerfile and add the following content:
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
Let's update the compose.yaml file in the project's root, adding the backend service.

Below is the updated version:
version: '3.9'

services:
  backend:
    container_name: backend
    image: backend
    build:
      context: ./backend
      dockerfile: backend.dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres?schema=public
    depends_on:
      - db
  db:
    container_name: db
    image: postgres:12
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata: {}

Build the backend image:
docker compose build
Start the backend container:
docker compose up -d backend
Check if the container is running:
docker ps -a
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Something interesting before we proceed or make any http requests.
docker exec -it db psql -U postgres
\dt
And we should see no relations.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Now type
docker exec -it backend npx prisma migrate dev --name init
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker
docker exec -it db psql -U postgres
\dt
And we should see the table User in the database. Of course it's still empy, but Prisma has created it for us. Cool!

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Add users in 3 different ways
Now let's create 3 different users using 3 different ways.

1 user using Prisma Studio
1 user using Postman
1 user using psql
Create a user using Prism Studio
Open a new terminal and type:
npx prisma studio
This will open Prisma Studio in your browser at http://localhost:5555 (Note: we are not using Docker to run Prisma Studio, we are running it directly on our machine).

Add a record: userfromprisma and userfromprismamail

hit Save 1 change. You can leave Prisma Studio open in a tab, we will use it later.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Now let's add another user using Postman (or any other tool you like).

If we make an http request to http://localhost:4000/users we should see 1 user (the one we just created using Prisma Studio).
{
  "name": "userfrompostman",
  "email": "userfrompostmanmail"
}
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

If we check localhost:4000/users we should see 2 users now:

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

We can also check again on Prisma Studio, to check the consistency of our operations.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

insert user from psql
Let's insert another user using psql.
docker exec -it db psql -U postgres
\dt
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Let's insert a new user manually using psql (don't do this in production, it's just for testing purposes!).
insert into "User" (name, email) values ('frompsql', 'userfrompsqlmail');
select * from "User";
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Let's check again on Prisma Studio, and we should see 3 users now:

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

4. Frontend
Now that we have the backend up and running, we can proceed with the frontend.

We will use Next.js 14 with TypeScript and Tailwind.

From the root folder of the project,
cd ..
And from the root folder of the project, run this command:
npx create-next-app@latest --no-git
We use the --no-git flag because we already initialized a git repository at the project's root.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

As options:

What is your project named? frontend
TypeScript? Yes
EsLint? Yes
Tailwind CSS? Yes
Use the default directory structure? Yes
App Router? No (not needed for this project)
Customize the default import alias? No
Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

This should create a new Next.js project in about one minute.

Step into the frontend folder:
cd frontend
Install Axios, we will use it to make HTTP requests (be sure to be in the frontend folder):
npm i axios
Before we proceed, try to run the project:
npm run dev
And open your browser at http://localhost:3000. You should see the default Next.js page.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Modify the styles/global.css file
In the src/frontend/src/styles/globals.css file, repalce the content with this one (to avoid some problems with Tailwind):
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0; 
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
Create a new component
In the /frontend/src folder, create a new folder called components and inside it create a new file called CardComponent.tsx and add the following content:
import React from 'react';

interface Card {
  id: number; 
  name: string;
  email: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div className="text-sm text-gray-600">ID: {card.id}</div>
      <div className="text-lg font-semibold text-gray-800">{card.name}</div>
      <div className="text-md text-gray-700">{card.email}</div>
    </div>
  );
};

export default CardComponent;

The file should look like this:

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Now, open the src/frontend/src/pages/index.tsx file and replace the content with the following:

Populate the index.tsx file
Open the file called index.tsx in the frontend/src/pages folder and replace the content with the following (explanation here) :
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [users, setUsers] = useState<User[]>([]); 
  const [newUser, setNewUser] = useState({ name: '', email: '' }); 
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Create a user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Update a user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
      setUpdateUser({ id: '', name: '', email: '' });
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a user
  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>

        {/* Form to add new user */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />

          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Add User
          </button>
        </form>

        {/* Form to update user */}
        <form onSubmit={handleUpdateUser} className="p-4 bg-green-100 rounded shadow">
          <input
            placeholder="User ID"
            value={updateUser.id}
            onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
            Update User
          </button>
        </form>

        {/* Display users */}
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
We can create another user directly from the UI by adding a name and email.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

We can also update a user directly from the UI, adding the user id, the new name and the new email.

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

If we check on localhost:4000/users we can see the changes we made using the UI

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

You can also delete a user directly from the UI

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Now stop the Next.js app by hitting Ctrl-C or Cmd-c, so we leave port 3000 available for the Dockerized Next.js app

Dockerize the frontend
Deploy a Next.js app with Docker.

Change the next.config.js file in the frontend folder, replacing it with the following content:
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone'
}

module.exports = nextConfig
Create a file called .dockerignore in the frontend folder and add the following content:
**/node_modules
Create a file called frontend.dockerfile in the frontend folder and add the following content (it's directly from the vercel official docker example)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build && ls -l /app/.next


# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
Now, let's update the docker-compose.yml file in the project's root, adding the frontend service.

Below the updated version:
version: '3.9'

services:
  frontend:
    container_name: frontend
    image: frontend
    build:
      context: ./frontend
      dockerfile: frontend.dockerfile
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    restart: always
    depends_on:
      - backend
  backend:
    container_name: backend
    image: backend
    build:
      context: ./backend
      dockerfile: backend.dockerfile
    ports:
      - '4000:4000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres?schema=public
    depends_on:
      - db
  db:
    container_name: db
    image: postgres:12
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgresD
      POSTGRES_DB: postgres
    ports:
      - 5432:5432
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata: {}
Build the frontend image:
docker compose build
Start the frontend container:
docker compose up -d frontend
5. Final test
First, let's check if all the 3 containers are running:
docker ps -a
Now, open your browser at http://localhost:3000. You should see the app running, but we are running it with Docker this time.

You can, for example, create a new user directly from the UI

Build a FULL STACK Web app with Javascript API, Next.js 14, Node.js, Express, Prisma,Postgres,Docker

Conclusion
We have created a full stack app, using Docker to run the database, the backend, and the frontend. We have also used Docker Compose to run the database, the backend, and the frontend together.

We used many technologies, but we didn't install anything on our machine except Docker and Node.js.

Next.js 14 (TypeScript)
Tailwind CSS
Node.js
Express (JavaScript)
Prisma
PostgreSQL
Docker
Docker Compose
If you prefer a video version

All the code is available for free on GitHub (link in video description).

If you have any questions, comment below or in the video comments

You can find me here:
Francesco

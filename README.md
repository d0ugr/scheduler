# Interview Scheduler

## Setup

Install dependencies with `npm install`.

Log in as a user with superuser privileges.

```
sudo -u postgres psql
```

```
CREATE USER scheduler_development WITH NOSUPERUSER PASSWORD 'password';
CREATE DATABASE scheduler_devlopment OWNER scheduler_development;
GRANT ALL ON DATABASE scheduler_devlopment TO scheduler_development;
```

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

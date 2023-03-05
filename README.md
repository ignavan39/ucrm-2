# Unnamed CRM

![image](https://user-images.githubusercontent.com/68580920/215728620-15b64c75-07cd-4c24-9a06-9a52ac383692.png)

#### 📌 it is fast and comfortable crm for your business

### 🤝 we can offer you:
- digital pipelines
- client cards with flexible field settings in the admin panel
- customer contacts, also with flexible field settings
- administration panel
- setting the rights of workers
- there is webhook support for your systems
- there is support for custom fields in customer cards and customer contacts


## Installation

```bash
$ yarn install
$ cp .env.example .env
```

## Running the app

```bash
$ docker compose up postgres

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

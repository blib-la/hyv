# Setting Up a Project for a Prisma Store Adapter for Hyv

A store adapter in Hyv is a custom implementation of the `StoreAdapter` interface. It is designed to
work with any database or storage system. In this guide, we will walk you through the process of
creating a Prisma store adapter for a PostgreSQL database.

## Prerequisites

Before you start, make sure you have the following installed:

1. Node.js and npm
2. Prisma CLI: You can install it by running `npm install @prisma/cli --save-dev`.

You also need to have a PostgreSQL database setup and its connection details available.

## Setting up Prisma

After installing the Prisma CLI, initialize Prisma in your project by running the following command:

```shell
npx prisma init
```

This command creates a `prisma` directory in your project, with two files inside: `schema.prisma`
(the Prisma schema file), and `.env` (the environment variables file).

Edit the `.env` file to include your database connection details. It should look something like
this:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

Replace `user`, `password`, `localhost`, `5432`, and `mydb` with your actual PostgreSQL connection
details.

In the `schema.prisma` file, define a `Message` model. For example:

```prisma
model Message {
  id      String   @id @default(cuid())
  content Json
}
```

The `id` field is the unique identifier of each message, and `content` is the field where we will
store the message content. `cuid()` generates a unique ID for each message, and `Json` allows us to
store a JSON object.

Run the following command to generate Prisma Client:

```shell
npx prisma generate
```

Prisma Client is a type-safe database client that's generated from your Prisma schema.

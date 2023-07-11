# Constructing a Prisma Store Adapter for Your Hyv Project

## Overview

In the Hyv library, a store adapter is a tailored implementation of the `StoreAdapter` interface,
purposed for compatibility with any database or storage system. This guide will lead you through the
process of creating a Prisma store adapter for a PostgreSQL database.

## Prerequisites

Before beginning, it's essential to ensure that Node.js and npm are installed on your system.
Additionally, the Prisma CLI should be installed, which can be accomplished by running
`npm install @prisma/cli --save-dev`. You should also have a configured PostgreSQL database with
accessible connection details.

## Guide

### Configuring Prisma

Post the installation of the Prisma CLI, initialize Prisma within your project by executing the
following command:

```shell
npx prisma init
```

This command will create a `prisma` directory in your project, containing two files: `schema.prisma`
(the Prisma schema file) and `.env` (the environment variables file).

Next, modify the `.env` file to include your database connection details, similar to this:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

Make sure to replace `user`, `password`, `localhost`, `5432`, and `mydb` with your actual PostgreSQL
connection details.

### Defining the Prisma Model

In your `schema.prisma` file, outline a `Message` model, as follows:

```prisma
model Message {
  id      String   @id @default(cuid())
  content Json
}
```

The `id` field serves as the unique identifier for each message, while the `content` field will hold
the message content. `cuid()` is employed to generate a unique ID for each message, and `Json`
enables the storage of a JSON object.

### Generating the Prisma Client

Finally, execute the following command to produce the Prisma Client:

```shell
npx prisma generate
```

The Prisma Client is a type-safe database client generated from your Prisma schema.

## Summary

In this guide, we have gone through the process of setting up a Prisma store adapter for a Hyv
project with a PostgreSQL database. We have installed the necessary prerequisites, set up Prisma,
defined a `Message` model, and generated the Prisma Client. This is the foundation for implementing
the `set` and `get` methods in the upcoming steps of this project.

## Tags

Hyv, StoreAdapter, Prisma, PostgreSQL, Node.js, npm, Prisma CLI, Message model, Prisma Client

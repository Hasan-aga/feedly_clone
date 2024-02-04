# Feedni

An Rss feed reader and content-aggregator. Inspired by Feedly.
[live demo](http://feedni.hasan.one/)

## Development

Run `yarn dev` to start development server.
This is a NextJS app so if you are not familiar with this framework check the NextJS docs.

The backend is devided into 3 layers:

1. The api endpoints: this layer only handles http requests. no data validation/processing.
2. The controller: this layer handles all data validation/processing.
3. The database (model): this layer handles querying the database. minimal data processing.

You will need to configure `http://localhost:3000` as an Authorized JavaScript origins and Authorized redirect origins in your auth provider.

For Google, you will need to create .env.local and provide these variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=****
GOOGLE_CLIENT_SECRET=****
NEXTAUTH_SECRET=****
NEXTAUTH_URL=****
PGHOST=<ip or domain name of postgres machine >
PGPASSWORD=****
PGUSER=<your postgres username>
PGDATABASE=<your postgres database name>
PGPORT=<your postgres port>
```

The frontend is your typical NextJS application.

The database schema looks like this:
![image](public/supbase_schema.png)

the database connection is configured in the environment at Vercel.

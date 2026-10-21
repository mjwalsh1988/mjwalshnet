# mjwalsh.net

Source for mjwalsh.net. The build plan is in docs/mjwalsh-net-build-plan.md.

## Database

The database is the Supabase project "Mjwalsh.net" (reference kavssklkhapzsdvkuwii, us-east-1). Schema changes are SQL files in supabase/migrations and are applied with the Supabase CLI, which is installed as a dev dependency. No key or password lives in this repo: the CLI keeps your login token and the database password in the Windows credential store.

One-time setup on a machine:

```
npm install
npx supabase login
npx supabase link --project-ref kavssklkhapzsdvkuwii
```

The link step asks for the database password. Enter it once and the CLI saves it to the credential store; nothing is written to the repo.

Day to day:

```
npm run db:new <name>    # create an empty migration file
npm run db:push          # apply pending migrations to the linked project
npm run db:list          # compare local and remote migration history
npm run db:types         # regenerate supabase/types/database.ts
```

# Project agent instructions

## Backend platform

This project is migrating from local browser repositories directly to the
standalone MiniBase platform. Do not create a Supabase project or add a direct
Supabase dependency unless the owner explicitly reverses this decision.

MiniBase repository:

- planned GitHub repository: `https://github.com/Murkin1980/minibase-cloudflare`
- runtime: separate Cloudflare Worker deployment;
- storage: isolated D1 database per application and R2 for files;
- provisioning: MiniBase management API, never Cloudflare tokens in client apps.

Client applications may contain only the MiniBase API URL and an
`mb_publishable_*` key. `mb_secret_*`, `mb_management_*` and Cloudflare API
tokens are server-side secrets and must never use a `VITE_*` variable.

Before requesting a new database, read `MINIBASE.md`. Until MiniBase has a
verified deployment, keep the existing local repository fallback operational.

## Windows paths

For all future repositories and technical workspaces use
`C:\Projects\<ascii-project-slug>`. Do not create new projects under OneDrive or
paths containing Cyrillic characters. This existing legacy workspace remains
in place, but scripts that cannot handle its path must use an ASCII worktree or
temporary copy.

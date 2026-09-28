-- ─────────────────────────────────────────────────────────────────────────────
-- Everything Mahir edits from /admin.
--
-- Five tables, deliberately few. `items` is one generic table for films, albums,
-- games, books and hobbies rather than five near-identical ones — they differ
-- only in what `subtitle` means (director / artist / platform / author), and
-- five tables would mean five CRUD screens to maintain forever.
--
-- Every table carries `published` and `position` so the admin can reorder and
-- hide without deleting. Nothing is ever hard-deleted by accident.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists items (
  id          bigint generated always as identity primary key,
  kind        text        not null check (kind in ('film', 'album', 'game', 'book', 'hobby')),
  title       text        not null,
  -- director / artist / platform / author, depending on kind
  subtitle    text,
  year        text,
  -- Mahir's own line. The whole point of the site; may be null while unwritten.
  note        text,
  -- kind-specific extras (rating, hours, rank, cover url) without new columns
  meta        jsonb       not null default '{}'::jsonb,
  -- "the one I'd defend in an argument"
  favourite   boolean     not null default false,
  -- reading now / playing now — drives the "currently" strip
  is_current  boolean     not null default false,
  position    integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists items_kind_idx on items (kind, published, position);

-- Photo-manipulation pieces, uploaded through /admin rather than committed to
-- the repo — there are a lot of them and they are large.
create table if not exists art (
  id          bigint generated always as identity primary key,
  title       text,
  caption     text,
  url         text        not null,
  -- kept so the grid can reserve space and never shift as images load
  width       integer,
  height      integer,
  -- tiny base64 LQIP so a slow connection sees the composition immediately
  placeholder text,
  year        text,
  position    integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists art_order_idx on art (published, position);

-- Ventures and shipped builds share a shape; `kind` separates them.
create table if not exists projects (
  id          bigint generated always as identity primary key,
  slug        text        not null unique,
  kind        text        not null check (kind in ('venture', 'build')),
  name        text        not null,
  what        text,
  role        text,
  status      text,
  year        text,
  url         text,
  repo        text,
  shot        text,
  stack       text[]      not null default '{}',
  why         text,
  broke       text,
  differently text,
  -- real, checkable numbers only: [{"label":"users","value":"12k"}]
  proof       jsonb       not null default '[]'::jsonb,
  position    integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_kind_idx on projects (kind, published, position);

-- Short dated entries. Build-in-public, and a reason to come back.
create table if not exists log (
  id           bigint generated always as identity primary key,
  body         text        not null,
  tag          text,
  happened_on  date        not null default current_date,
  published    boolean     not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists log_date_idx on log (published, happened_on desc);

-- Loose singletons: the hero line, the "currently building" string, socials.
create table if not exists settings (
  key        text primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now()
);

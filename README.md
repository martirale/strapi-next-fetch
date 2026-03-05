# strapi-next-fetch

Minimal Strapi REST API client for Next.js App Router with built-in ISR cache support.

Handles auth headers, query string serialization for nested params (filters, populate, pagination),
and Next.js fetch cache options (`revalidate`, `force-cache`, `no-store`).

## Install

```bash
# npm
npm install @itsmrtr/strapi-next-fetch

# pnpm
pnpm add @itsmrtr/strapi-next-fetch

# yarn
yarn add @itsmrtr/strapi-next-fetch
```

## Setup

Create a single client instance and reuse it across your project:

```js
// lib/strapi.js
import { createStrapiClient } from "@itsmrtr/strapi-next-fetch";

const strapi = createStrapiClient({
  url: process.env.STRAPI_API_URL,
  token: process.env.STRAPI_API_TOKEN,
});

export default strapi;
```

## Usage

### Basic fetch

```js
import strapi from "@/lib/strapi";

const data = await strapi.fetch("/api/articles");
```

### With fields and populate

```js
const data = await strapi.fetch("/api/articles", {
  fields: ["title", "slug", "date"],
  populate: {
    cover: { fields: ["url"] },
    category: { fields: ["title", "slug"] },
  },
});
```

### With filters and pagination

```js
const data = await strapi.fetch("/api/articles", {
  filters: {
    featured: { $eq: true },
    podcast: { $ne: true },
  },
  pagination: { page: 1, pageSize: 9 },
  sort: ["date:desc"],
});
```

### ISR with revalidate (Next.js App Router)

```js
// Revalidate every 15 minutes
const data = await strapi.fetch(
  "/api/articles",
  { sort: ["date:desc"] },
  { revalidate: 900 }
);
```

### No cache (drafts, live previews)

```js
const data = await strapi.fetch(
  "/api/articles",
  { filters: { slug: { $eq: slug } } },
  { cache: "no-store" }
);
```

### Daily cache (static content that rarely changes)

```js
const data = await strapi.fetch(
  "/api/categories",
  { fields: ["title", "slug"], sort: ["title:asc"] },
  { revalidate: 86400 }
);
```

### Draft mode (Strapi v5)

```js
const data = await strapi.fetch(
  "/api/articles",
  {
    filters: { slug: { $eq: slug } },
    status: "draft",
  },
  { cache: "no-store" }
);
```

### Build URL without fetching

```js
const url = strapi.buildUrl("/api/articles", {
  filters: { slug: { $eq: "my-article" } },
});
// https://your-strapi.com/api/articles?filters[slug][$eq]=my-article
```

## Practical pattern: query functions per project

Keep your query functions in your own project, using the client:

```js
// lib/queries/articles.js
import strapi from "@/lib/strapi";

export async function getLatestPosts({ page = 1, pageSize = 9 } = {}) {
  return strapi.fetch(
    "/api/articles",
    {
      fields: ["title", "slug", "date"],
      populate: {
        cover: { fields: ["url"] },
        category: { fields: ["title", "slug"] },
      },
      pagination: { page, pageSize },
      sort: ["date:desc"],
    },
    { revalidate: 900 }
  );
}

export async function getSingleArticle(slug) {
  return strapi.fetch(
    "/api/articles",
    {
      fields: ["title", "date", "content", "slug"],
      populate: {
        cover: { fields: ["url", "caption"] },
        category: { fields: ["title", "slug"] },
      },
      filters: { slug: { $eq: slug } },
    },
    { revalidate: 900 }
  );
}
```

## Environment variables

```bash
STRAPI_API_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your-api-token
```

## Compatibility

- Next.js 14+ (App Router)
- Strapi v4 and v5
- Node.js 18+

## License

MIT

# Fatco GH

A clean, mobile-first football jersey storefront for Fatco GH in Accra, Ghana. The frontend and backend are fully standalone applications with separate dependencies and configuration.

## Homepage preview

![Fatco GH storefront homepage](frontend/public/images/fatco_homepage_front.png)

## Project structure

```text
fatco/
├── frontend/               # Browser application only
│   ├── public/             # Static images and favicon
│   ├── src/                # React pages, components, state and API client
│   ├── .env.example.local  # Browser-safe environment template
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.ts
├── backend/                # Server application only
│   ├── prisma/             # PostgreSQL schema, migrations and seed
│   ├── supabase/           # Optional Storage policy setup
│   ├── src/                # Express routes, Prisma services and Auth middleware
│   ├── .env.example.local  # Private server environment template
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json        # Backend dependencies and scripts
│   └── tsconfig*.json
└── README.md               # Documentation for the whole system
```

The packages communicate only over HTTP. The frontend never imports backend source code, and the backend never imports frontend source code.

The included catalogue and images are explicitly demo content. Replace them before launch.

## Brand and SEO assets

Brand files live in `frontend/public/images/brand/`:

- `fatco-logo.png` — transparent horizontal website wordmark
- `fatco-icon.png` — transparent square emblem master
- `fatco-og.jpg` — 1200×630 Open Graph and social-sharing image

Favicon sizes, the Apple touch icon, and `site.webmanifest` live directly in `frontend/public/`. Open Graph and Twitter metadata are configured in `frontend/index.html`, while page titles and descriptions are updated by the React SEO component. Replace the placeholder `https://fatco.example` social-image origin in `frontend/index.html` with the final public domain before launch.

## Tech stack

- React 19, TypeScript, Vite, React Router, TanStack Query
- Plain responsive CSS, Lucide icons, Zod validation
- Node.js, Express, TypeScript, Prisma ORM
- Supabase-hosted PostgreSQL, Supabase Auth, and optional Storage

## Local development

Requires Node 20.19+, 22.13+, or 24+ (the current tooling reports engine warnings on older patch releases).

Install and run the backend in the first terminal:

```bash
cd backend
npm install
cp .env.example.local .env
npm run dev
```

Install and run the frontend in a second terminal:

```bash
cd frontend
npm install
cp .env.example.local .env
npm run dev
```

Open `http://localhost:5173`; the API runs at `http://localhost:5001` (port 5000 is commonly occupied by AirPlay on macOS). Without a data connection, the public store uses the transparent demo catalogue while order and admin mutations remain disabled. When the Supabase server credentials are configured, the backend uses the Supabase data API if `DATABASE_URL` is absent. `DIRECT_URL` is only required by Prisma migration commands.

## Environment setup

Each application owns its environment. Copy `frontend/.env.example.local` to `frontend/.env` and `backend/.env.example.local` to `backend/.env`. Frontend `VITE_` values are browser-visible. Database credentials and the service-role key exist only in the backend environment.

For production, set `VITE_API_URL` to the deployed API URL and `CLIENT_URL` to the storefront origin. The payment boundary is currently manual: checkout records an unpaid order and Fatco GH confirms payment separately. A Paystack, Flutterwave, or Mobile Money adapter can later be added behind the server order flow.

## PostgreSQL, Prisma, and Supabase setup

1. In the Supabase dashboard, open **Connect**. Put the pooled PostgreSQL URI in `DATABASE_URL` and the direct/session URI in `DIRECT_URL`.
2. Add the project URL, anonymous key, and service-role key to `.env`.
3. Generate the client, deploy the backend migration, and optionally seed demo products:

```bash
cd backend
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
```

Prisma owns the application schema in `backend/prisma/schema.prisma`. The resulting PostgreSQL tables remain fully visible and editable in the Supabase dashboard. Run `npm run prisma:studio` from `backend/` to open Prisma Studio.

4. Create the store owner in Supabase Authentication. In the SQL editor, give that user an admin claim (replace the UUID):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where id = 'YOUR_USER_UUID';
```

Sign in at `/admin`. Express verifies the Supabase access token and admin claim, then performs database work through Prisma. The browser never accesses application tables directly. For image uploads, run `backend/supabase/storage.sql` in the Supabase SQL editor and keep `SUPABASE_STORAGE_BUCKET=product-images` in the backend environment. Product uploads accept JPG, PNG, WebP, and AVIF files up to 300 KB; the frontend, Express endpoint, and Storage bucket all enforce the limit.

## Adding and updating products

Use `/admin/products` to manage inventory. You can upload a product image (maximum 300 KB) or enter an existing image URL. For bulk changes, use Supabase Table Editor or run `npm run prisma:studio` inside `backend/`. Slugs must be lowercase words separated by hyphens and remain unique.

Configuration likely to change is centralized in `frontend/src/config/business.ts`. Backend demo fallback products live in `backend/src/config/demoProducts.ts`; Prisma/PostgreSQL products are preferred when configured.

## Contact page and message delivery

The contact page is available at `/contact`. It displays the store address, phone number, email address, opening hours, a WhatsApp link, and an embedded Google Map. Contact values come from `frontend/src/config/business.ts`; update that file with the final store address, contact details, opening hours, and social links before launch. The map embed is configured directly in `frontend/src/pages/ContactPage.tsx`.

The message form submits the visitor's name, email, phone number, and message directly to FormSubmit, which forwards submissions to `testerofpages@gmail.com`. Browser validation requires names of at least 2 characters, phone numbers of at least 7 characters, messages of at least 10 characters, and a valid email address. FormSubmit supplies the reply-to behavior, table-formatted email, honeypot field, and its default reCAPTCHA protection; the application backend is not involved.

The first submission triggers an activation email from FormSubmit. Open that message in `testerofpages@gmail.com` and confirm the form before expecting visitor messages to arrive. Check the spam folder if the activation or a submission is missing. After activation, FormSubmit provides a random endpoint token that can replace the visible email address in the form `action` in `frontend/src/pages/ContactPage.tsx`.

Changing the destination address requires updating that action and activating the form again for the new mailbox. Test the deployed form after every destination or domain change. Because submissions are handled by a third party, reflect FormSubmit processing in the site's privacy notice before launch.

## API

Public: `GET /api/products`, `GET /api/products/:slug`, `POST /api/orders`, and `GET /api/health`. Admin product CRUD and order listing live under `/api/admin` and require an admin bearer token. Contact messages submit directly from the browser to FormSubmit as described above.

## Checks and production

Run these commands separately inside both `frontend/` and `backend/`:

```bash
npm run typecheck
npm run lint
npm run build
```

The frontend also provides `npm run preview`. Its build is written to `frontend/dist/` and needs SPA fallback to `index.html`. The backend build is written to `backend/dist/`; deploy that folder with the backend package files and run `npm start` from `backend/`.

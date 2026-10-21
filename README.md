# StoreAdmin — Next.js + Tailwind + MongoDB

Built with JavaScript (JSX), not TypeScript. A responsive product administration dashboard inspired by the supplied reference image. Includes product listing, search, category/status filters, sorting, table/grid views, pagination, add/edit forms, product detail pages, delete confirmation, loading/empty/error feedback, and a mobile navigation layout.

## Requirements
- Node.js 20.9 or newer
- MongoDB Community Server running locally
- MongoDB Compass (optional GUI for inspecting the local database)

## Run locally
1. Extract the ZIP and open this folder in VS Code.
2. Install packages:
   ```bash
   npm install
   ```
3. Create `.env.local` in the project root and add:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/storeadmin
   ```
   `.env.example` contains the same local connection string.
4. Start MongoDB Community Server. In MongoDB Compass, connect to `mongodb://127.0.0.1:27017` and look for the `storeadmin` database after the first product is created.
5. Start the app:
   ```bash
   npm run dev
   ```
6. Visit http://localhost:3000/products

## MongoDB Compass
- Open Compass and connect to `mongodb://127.0.0.1:27017`.
- The database and `products` collection are created automatically when the first product is saved through the app.
- Data is stored in the `storeadmin.products` collection.

## Architecture
- `app/`: App Router pages and REST route handlers.
- `components/`: reusable sidebar, top bar, and product form.
- `models/Product.js`: Mongoose schema.
- `lib/mongodb.js`: cached Mongoose connection helper.
- `lib/sample-products.ts`: local demo fallback shown if MongoDB is unavailable.
- `app/api/products/`: CRUD endpoints (`GET`, `POST`, `GET by id`, `PUT`, `DELETE`).

## Notes
- Product images are stored as data URLs in the document for this starter project. For production, use an object storage service and store only the image URL in MongoDB.
- Demo products are in-memory fallback examples and are not saved in MongoDB. Create a new product while MongoDB is connected to test persistent CRUD.
- The Orders, Customers, Categories and Settings navigation destinations are starter placeholders; this build focuses on the product-management flow shown in the reference.
- This project does not include authentication/authorization. Add protected admin authentication before deploying publicly.

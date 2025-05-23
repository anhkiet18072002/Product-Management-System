# Product-Management-System

## Backend
<details>
  <summary><strong>⚙️ Setup & Installation Instructions</strong></summary>

#### :white_check_mark: Clone the repository 
- git clone https://github.com/anhkiet18072002/Product-Management-System.git
- cd backend
#### :white_check_mark: Install dependencies
- yarn install
#### :white_check_mark: If you want to use your database
- Change DATABASE_URL in file .env to your url
- yarn prisma db seed to get sample database
#### :white_check_mark: Start the server
- yarn start:dev

</details>

<details>
<summary> 💡 API documentation </summary>

   <br>
   
I use Swagger (OpenAPI) to provide detailed API documentation for this project.
You can access the Swagger UI at: http://localhost:3001/docs
</details>



<details>
<summary>💡 Explanation of caching, optimization strategies, and like feature </summary>
   <br>
<details>
  <summary>🧠 Caching Explanation</summary>

  <br>

  This project uses a custom `CacheInterceptor` to improve performance and reduce database load by caching responses of `GET` requests — especially for endpoints like `/products`.

  ## 🔧 How It Works

  #### ✅ For `GET` Requests:
  - When a `GET` request is received:
    - A **cache key** is created from the request’s `originalUrl`.
    - The cache manager checks if a cached response exists:
      - If **found**, the cached response is returned immediately.
      - If **not found**, the request continues to the controller, and the result is **stored in cache** with a TTL (Time-To-Live) of 60 seconds.
    - If the URL starts with `/products`, the cache key is added to a `productCacheKeys` set for future invalidation.

  #### ❌ For `POST`, `PUT`, `PATCH`, `DELETE` Requests to `/products`:
  - The interceptor:
    - Deletes all cached entries related to `/products` using the stored keys.
    - Clears the `productCacheKeys` set.
    - Proceeds with the request as usual.

  ### 📌 Benefits
  - ⚡ **Faster response times**: Cached data is served quickly without processing.
  - 🧠 **Reduces database queries**: Avoids unnecessary reads from the database.
  - 🧹 **Smart invalidation**: Automatically clears cache when products are created, updated, or deleted.

</details>

<details>
  <summary>🧠 Optimization Strategies</summary>

 <br>
 
This project follows a **DRY (Don't Repeat Yourself)** principle by implementing a reusable `BaseService` class. The `BaseService` encapsulates common CRUD logic and query processing, allowing other resource-specific services to extend it with minimal boilerplate.

### 🔍 Key Benefits

- ✅ **Code Reuse**: All services can inherit and reuse `create`, `findAll`, `findOne`, `update`, and `remove` methods.
- ✅ **Centralized Logic**: Search, sorting, pagination, and field selection logic are handled in one place.
- ✅ **Cleaner Services**: Individual resource services focus only on resource-specific logic and configurations.

### 📦 Features in `BaseService`

- **Pagination & Limit Handling**  
  Ensures a safe max limit of 1000 records per request.
  
- **Sorting Logic**  
  Supports dynamic sorting via `?sort=field|asc|desc`.

- **Search with `OR` Conditions**  
  Allows case-insensitive search across defined fields using Prisma’s `contains`.

- **Field Whitelisting**  
  Only allows update of fields defined in the Prisma schema to prevent unexpected behavior.

- **Dynamic `select` Support**  
  Accepts custom field selections while defaulting to a shared `defaultSelect`.

### 🏗️ How to Use

To use the base service for a specific model:

```ts
@Injectable()
export class ProductService extends BaseService {
  defaultSelect: Prisma.ProductSelect = {
    ...baseSelect,
    name: true
  };

  defaultSearchFields?: string[] = ['name'];

  constructor(readonly private prisma: PrismaService) {
    super(prisma.product);
  }
}
```
</details>
<details>
  <summary>🧠 Like feature</summary>

  <br>

  This project implements a **like/unlike** feature for products. Each user can **like a product once**, and likes can be **toggled** (liked → unliked → liked...).

### 🧩 How It Works

- A **many-to-many relation** is created between `User` and `Product` using a join table called `product_like`.
- The `product_like` table includes:
  - `userId` – the user who liked
  - `productId` – the product that was liked

### 🔁 Toggle Behavior

When a user likes/unlikes a product, the following logic is applied:

1. **Check if the user already liked the product**:
    - Search the `product_like` table for a record with both `userId` and `productId`.

2. **If a record exists**:
    - The user already liked the product.
    - The system deletes the record from `product_like`.
    - Response: `{ message: 'Unlike' }`

3. **If no record exists**:
    - The user has not liked the product yet.
    - A new record is inserted into `product_like`.
    - Response: `{ message: 'Like' }`

```ts
// Simplified logic
if (userHasLiked) {
  await prisma.product_like.delete(...);
  return { message: 'Unlike' };
} else {
  await prisma.product_like.create(...);
  return { message: 'Like' };
}
```

### 🔢 Tracking the Number of Likes

The number of likes for each product is tracked by counting how many users have liked that product. 

This is done by querying the product_like table — a many-to-many relationship table between User and Product — and counting all entries with the matching productId.

```ts
const numberOfLike = await this.prisma.productLike.count({
  where: { productId: id },
});
return numberOfLike
```
✅ This method ensures a real-time and accurate count of likes for each product.

🔄 The count updates automatically when a user likes or unlikes the product.
</details>
</details>


## Frontend
<details>
  <summary><strong>⚙️ Setup & Installation Instructions</strong></summary>

#### :white_check_mark: Clone the repository 
- git clone https://github.com/anhkiet18072002/Product-Management-System.git
- cd frontend
#### :white_check_mark: Install dependencies
- yarn install
#### :white_check_mark: Start the server
- yarn dev
</details>


<details>
  <summary>💡 Web documentation</summary>
  <br> 
  
### 🚀 Getting Started

- Initially, users can access the admin interface by visiting:
  - `http://localhost:3000/admin`  
  - or `http://localhost:3000/admin/dashboard`

- These pages provide the basic layout and core features of the admin panel.

- From the dashboard, users can navigate to the **Product** page using the left-side navigation menu.

---

### 🔐 Authentication & Post-login Behavior
- After a successful login, users are redirected to the **Admin Dashboard** (`/admin/dashboard`).
- Users can navigate to the **Product** page via the navigation menu on the left sidebar.

---

### 📋 Product Page Features

- The product page displays a **list view** of products combined with **pagination** for easy browsing.
- Each product entry shows:
  - **Name**
  - **Price**
  - **Category**
  - **Subcategory**
  - **Number of like**
- Users can **like** products directly from this list.

---

### ⚠️ Special Admin Privileges

- When logged in as the admin user with the email **`admin@example.com`**:
  - The **Like** button is replaced with **Edit** and **Delete** actions.
  - Only the admin has the rights to **edit** or **delete** products.
  
---
</details>


<details>
  <summary>🔐 Authentication & Access Control</summary>

<br>

  - ✅ **Users must log in before adding or liking a product**  
- 👀 **Guest users can only view products**

---

##### ⚙️ Middleware Authentication

The website uses middleware to:

- 🚫 Block unauthenticated users from accessing the **Add Product** page (e.g., `/admin/product/add`).  
- 🔑 Check for a valid **accessToken** in cookies before allowing users to like a product.  
- 🔄 Redirect users to the **Login** page (`/login`) if they are not authenticated.

---

##### 👍 Like Feature Access Control

Before a user can like or unlike a product, the system verifies whether they are logged in by checking the presence of an **accessToken**.

- ❌ If the user is not logged in, they will be redirected to the login page.

---
</details>



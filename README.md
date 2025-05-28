CRAVORY

Cravory is a full-stack food delivery web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It features **role-based access control (RBAC)**, allowing different interfaces and functionalities for **users** and **admins**, along with **secure Stripe payment integration** including 3D Secure authentication.

🧑‍💻 User Functionality

* Browse available food items
* Add items to the cart
* Adjust quantities and view cart totals
* Secure checkout using Stripe (supports 3D Secure)
* View and manage past orders

🛠️ Admin Functionality

* Admin login (restricted to one-time registered account)
* Add, edit, or delete food items
* Manage the entire menu
* Monitor orders and payment statuses

💳 Stripe Integration

* Secure checkout with 3D Secure flow
* Webhook-based order status tracking
* Orders are deleted if payment fails or is canceled
 
🛠️ Tech Stack

| Layer    | Tech                     |
| -------- | ------------------------ |
| Frontend | React, Vite, Context API |
| Backend  | Node.js, Express.js      |
| Database | MongoDB (Mongoose)       |
| Payments | Stripe API               |
| Auth     | JWT (JSON Web Tokens)    |

📁 Folder Structure

```
📆 client
 ├📂 components       
 ├📂 pages            
 ├📂 context          
 └📜 main.jsx         

📆 server
 ├📂 routes           
 ├📂 models           
 └📜 index.js         

 


# 🛠️ E-Retail Admin

Admin dashboard for managing products, orders, and users, built with **React**, **Redux**, **Express**, **MySQL**, and **Google Generative AI**.  
It is currently being migrated to the **Next.js** framework.

---

## 🚀 Features

- View, add, edit, and delete products  
- Manage customer orders and order statuses  
- User management and role-based access  
- AI-assisted product descriptions (Google Generative AI)  
- Responsive admin UI

---

## 🖥️ Local Setup Guide

Follow these steps to install and run the admin dashboard locally.

---

### 1. 📦 Install Required Tools

Ensure you have installed:

- Node.js + npm: https://nodejs.org/  
- Visual Studio Code: https://code.visualstudio.com/  
- Git: https://git-scm.com/  
- XAMPP: https://www.apachefriends.org/ (for MySQL backend)

---

### 2. 🔁 How to Clone and Run the App

1. Open your terminal or Git Bash  
2. Clone the repository:

```bash
git clone https://github.com/ivicakartelo/e-retail-admin.git
```

3. Navigate into the project folder:

```bash
cd e-retail-admin
```

4. Install the dependencies:

```bash
npm install
```

5. Start the app:

```bash
npm start
```

The dashboard will run at: [http://localhost:3001](http://localhost:3001) _(or your configured port)_

---

### 3. 🗄️ Import the Database

1. Start **XAMPP** and open **phpMyAdmin**  
2. Create a database named: `e_retail_admin`  
3. Import the provided SQL file via the **Import** tab

---

### 4. 🔐 Create a `.env` File

In the root directory, create `.env` and add:

```env
REACT_APP_GENAI_API_KEY=your_google_generativeai_api_key  
REACT_APP_STRIPE_SECRET_KEY=your_stripe_secret_key  
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

### 5. ⚠️ Add `.env` to `.gitignore`

Ensure `.env` is listed in `.gitignore`:

```
.env
```

---

## 📚 License

MIT License

Copyright (c) 2025 Ivica Kartelo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.

---

## ✨ Author

Created by [@ivicakartelo](https://github.com/ivicakartelo)

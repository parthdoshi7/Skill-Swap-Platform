## Project name- Skill Swap

## 👥 Authors
- **Parth Doshi**  
  Email: pmdoshi21@gmail.com
- **Janvi Kalola**  
  Email: janvikalola@gmail.com

# 🔄 SkillSwap Platform — Backend

Welcome to the **SkillSwap Platform Backend** — an intelligent skill-exchange system where users can request and offer skills, match with others, and build real connections through learning and collaboration. This Node.js backend powers the logic for swap requests, matching, and user management.

---

## 🚀 Tech Stack

- 🧠 **Node.js**
- ⚡ **Express.js**
- 🗃️ **MongoDB**
- 🔐 **JWT (Authentication-ready)**
- 🛠️ REST APIs
- 🌐 **Frontend: React.js**

---

## 📦 Features

- 👤 **User Account System**
  - Create & manage user profile
  - Fetch profile details via email

- 🤝 **Skill Swap Request System**
  - Users can offer a skill and request another
  - Full and partial match support

- 📨 **Assign Swap Requests**
  - Assign a target user manually 
  - If full match: both requests updated
  - If one-way: partial match stored and waiting for confirmation

- 📬 **Incoming Request Viewer**
  - Assigned users can view incoming swap requests
  - Ready to be accepted or rejected

- ✅ **Accept / Reject Swaps**
  - Target user confirms or declines match

- 🌐 **Explore Requests**
  - Fetch all pending skill swap requests for browsing

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/swaps/swap` | ➕ Create a new swap request |
| `PATCH` | `/api/swaps/assign` | 🔁 Assign a swapper by matching skills |
| `GET` | `/api/swaps/incoming?email=` | 📩 Get incoming requests assigned to a user |
| `GET` | `/api/swaps/all` | 🌍 Browse all swap requests |
| `GET` | `/api/swaps/mine?email=` | 🧾 View your own submitted requests |
| `PATCH` | `/api/swaps/status` | ✅ Accept or ❌ Reject a swap (coming soon) |
| `POST` | `/api/Login` | For Login The user |
| `POST` | `/api/add` | For Register The user |
| `POST` | `api/profile/:email` | For Viewing the user Profile|
---

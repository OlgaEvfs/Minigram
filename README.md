# Minigram 📸

A minimalist web application for sharing posts with images and reactions. This project follows the **MVC** (Model-View-Controller) architecture, utilizing **TypeScript** on the frontend and **Node.js** with a **SQLite** database on the backend.

## ✨ Features

*   **Post Gallery**: All images are automatically fitted to a consistent size without distortion using `object-fit: cover`.
*   **Reactions**: Interactive "Like", "Wow", and "Haha" reactions for every post.
*   **Database Persistence**: Posts and reactions are stored permanently in SQLite via the Sequelize ORM.
*   **Pill-shaped Delete Button**: A compact deletion tool aligned next to reactions.
*   **Reliability**: The project is covered by 14 tests (API, models, and controllers).

## 🛠 Tech Stack

*   **Frontend**: TypeScript, HTML5, CSS3 (Vanilla).
*   **Backend**: Node.js, Express.
*   **Database**: SQLite + Sequelize ORM.
*   **Testing**: Jest, Supertest, ts-jest.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Frontend (TypeScript -> JS)
```bash
npm run build
```

### 3. Start the Server
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

The project includes 14 tests covering all application layers:
*   **API**: Endpoint tests (create, get, delete, reactions).
*   **Models**: Logic tests for TypeScript models.
*   **Controllers**: Controller testing using mocks for `fetch` and the `View`.

To run all tests:
```bash
npm test
```

## 📁 Project Structure

*   `server.js` — Express server and DB logic.
*   `src/` — TypeScript source code (Models, Controllers, Views).
*   `public/` — Static assets (HTML, CSS) and compiled JavaScript.
*   `tests/` — Directory for unit and integration tests.
*   `database.sqlite` — Local database file (ignored by Git).

---
Developed for educational purposes as an example of a Fullstack application using the MVC pattern.

[statbench360_readme.md](https://github.com/user-attachments/files/34595003/statbench360_readme.md)
# StatBench360 ⚽📊

**StatBench360** is a professional, enterprise-grade, single-file web application designed for football coaches and technical staff to perform real-time match tracking, lineup management, advanced substitution window control, and detailed statistical reporting directly from any mobile device or browser.

---

## 🌟 Key Pillars & Features

### 1. 🛡️ Security & Reliability (XSS & Storage Protection)
* **XSS Prevention:** All user-supplied inputs (player names, team names, tactical notes) are strictly escaped and sanitized before rendering to eliminate code injection vulnerabilities.
* **Resilient Storage Engine:** Implements versioned (`v4`) state persistence in `localStorage` with automatic structure validation and fallback recovery mechanisms against browser corruption.

### 2. ⏱️ High-Precision Time Control
* **Timestamp-Based Timer:** Upgraded from basic `setInterval` ticks to real-time `Date.now()` elapsed calculation. The match clock remains perfectly accurate and survives mobile background execution, screen locking, or app minimization.
* **Voice Alerts:** Configurable interval audio alerts (e.g., every 5 minutes) and custom exact-minute voice notifications to keep the bench fully aware of time.

### 3. 🔄 Advanced Substitution & Window Management
* **Decoupled Windows & Substitutions:** Allows multiple player changes within a single tactical pause, correctly tracking official substitution windows (max 3 per team) without prematurely exhausting them.
* **Smart Card & Expulsion Rules:** Prevents registering new amonestations to already expelled players, correctly handles double yellow cards, direct reds, and own-goal mechanics.

### 4. 📁 Secure Import, OCR & Export
* **File Validation & OCR:** Supports importing squad rosters via `.txt`, `.csv`, or direct photo OCR scanning using Tesseract.js (with file size safety limits).
* **Formula Injection Prevention:** CSV and Excel exports sanitize values starting with `=`, `+`, `-`, or `@` to prevent spreadsheet formula execution vulnerabilities.
* **Professional PDF Match Reports:** Generates official match sheets with detailed player minutes, goals, assists, and chronological incident logs ready for WhatsApp sharing or archiving.

---

## 🚀 Getting Started

StatBench360 follows a strict **Single-File Architecture**. There are no complex build steps, node modules, or database setups required.

1. Download or clone the repository containing the application (`index.html`).
2. Open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge).
3. Add your players manually or import a roster file.
4. Click **Resetear / Nuevo** to initialize a clean match state and begin tracking!

---

## 🛠️ Built With
* **Vanilla JavaScript (ES6+):** Object-oriented architecture with robust state management.
* **Tailwind CSS:** Fully responsive, modern mobile-first dark UI design.
* **FontAwesome:** Clean vector iconography.
* **jsPDF:** Client-side PDF generation for official match sheets.
* **Tesseract.js:** Optical Character Recognition (OCR) for squad photo scanning.

---

## 📄 License
This project is open-source and available for coaching staffs and football analytics enthusiasts.

# 🤖 AI Research Assistant

An AI-powered academic research workspace designed to help students and researchers organize research work and create editable, structured academic drafts from a topic.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀%20LIVE%20DEMO-Open%20Application-16a34a?style=for-the-badge&logo=vercel)](https://research-assistant-frontend-kappa.vercel.app/)
[![Source Code](https://img.shields.io/badge/📂%20SOURCE%20CODE-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/anubhavsahu1232-cmd/AI-Research-Assistant)

</div>

> **Project status:** Academic minor-project implementation. Features and integrations may evolve as development continues.

## ✨ Overview

AI Research Assistant brings research-paper organization and AI-assisted academic writing into one application. A user can provide a research topic, generate a structured first draft, review and edit the generated sections, and save the draft for later work.

## 🚀 Core Features

- **AI-assisted draft generation** — generate a structured academic draft from a user-provided topic.
- **Structured academic content** — organize the draft into:
  - Title
  - Abstract
  - Keywords
  - Introduction
  - Literature Review
  - Methodology
  - Discussion / Conclusion
- **Editable output** — review and modify generated content before saving.
- **Draft management** — save generated work and continue editing it later.
- **Research workspace** — keep research-related work organized in one application.
- **REST API backend** — frontend communicates with backend services through API endpoints.

## 🌐 Live Application

Try the deployed frontend here:

**[AI Research Assistant – Live Demo](https://research-assistant-frontend-kappa.vercel.app/)**

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot |
| API | REST APIs |
| AI integration | AI model/API integration (provider depends on project configuration) |
| Development tools | Git, GitHub, VS Code, Maven |

**Database:** Configure according to the current backend implementation. Add the exact database and version here once finalized.

## 🏗️ High-Level Architecture

```text
                  ┌────────────────────────┐
                  │       User             │
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │    React Frontend      │
                  │ Research & Draft UI    │
                  └───────────┬────────────┘
                              │ REST API
                              ▼
                  ┌────────────────────────┐
                  │  Spring Boot Backend   │
                  │ Controllers / Services │
                  └───────┬────────┬───────┘
                          │        │
                 ┌────────▼───┐ ┌──▼────────────────┐
                 │ Draft /    │ │ AI Service        │
                 │ Research   │ │ External Model API│
                 │ Services   │ └───────────────────┘
                 └────────────┘
```

## 🔄 Typical Workflow

1. Open the application.
2. Enter a research topic.
3. Request AI-assisted draft generation.
4. Review the generated academic sections.
5. Edit the content as needed.
6. Save the draft and continue working on it later.

## ▶️ Running the Project

The repository may contain separate frontend and backend directories. Open the relevant directory in a terminal and use the commands below after checking its configuration.

### Backend (Spring Boot)

```bash
mvn spring-boot:run
```

If the project uses the Maven wrapper:

```bash
./mvnw spring-boot:run
```

On Windows:

```bat
mvnw.cmd spring-boot:run
```

### Frontend (React)

From the frontend directory:

```bash
npm install
npm start
```

If the project was created with Vite, use:

```bash
npm run dev
```

> Check the frontend `package.json` and backend configuration for the exact scripts, ports, database settings, and required environment variables. Never commit API keys, passwords, or other secrets.

## 🔐 Configuration & Security

- Keep AI provider keys and database credentials in environment variables or local configuration excluded from Git.
- Do not hard-code secrets in source code.
- Configure the frontend API base URL for the backend environment you are using.
- Use sample environment files (without real credentials) when documenting required configuration.

## 🛣️ Future Enhancements

- Improved research-paper library and organization.
- More control over generated sections and writing styles.
- Export drafts into academic document formats.
- Citation and reference assistance.
- More robust validation, testing, and deployment workflows.

## 🎓 Project Purpose

This project is developed as an academic software project to explore full-stack application development, REST API integration, and practical use of AI-assisted writing workflows.

## 👨‍💻 Author

**Anubhav Sahu**  
MCA Student | Java & Spring Boot Developer

- GitHub: https://github.com/anubhavsahu1232-cmd
- LinkedIn: https://www.linkedin.com/in/anubhav-sahu-92599222b/

---

⭐ If you find this project interesting, consider giving the repository a star.

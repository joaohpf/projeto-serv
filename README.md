# SeRV — Sistema Educacional de Rio Verde

**Author:** João Henrique Porfirio Firmiano

School management dashboard prototype for Rio Verde's municipal schools, with student, teacher and developer (admin) profiles. It won **1st place** at UniRV's "Do Código ao Mercado" software innovation competition.

## Problem

In the municipal school network, students, parents and teachers had no single place to follow class schedules and deadlines, grades, attendance, the school menu and school announcements, or to send requests to the school office.

## Solution

A web dashboard where each profile sees only what it needs: students follow their calendar, grades, attendance, notes and requests; teachers enter grades and publish to the forum; the developer profile monitors logs and manages a permissions matrix.

I used **Claude (Anthropic)** throughout the project: to build the single-page front end from my requirements (glassmorphism design, role-based menus, calendar with deadline colors), to write the Node.js/Express back end with session login, and to prepare the competition material (documentation, pitch deck, Business Model Canvas, financial model and validation forms).

## Technologies

- HTML, CSS and JavaScript (single page)
- Node.js, Express and express-session
- Vercel (hosting)
- Claude (Anthropic): AI coding and documentation assistant

## Demo

- Live prototype: **https://prototype-serv.vercel.app**
- News about the 1st place: [UniRV](https://www.unirv.edu.br/ver_noticias.php?codabr=20269)

## Result

- 1st place at UniRV's "Do Código ao Mercado" competition.
- With AI, the team went from idea to a working, published prototype plus the full business material within the course schedule.

## Repository

```
server.js          Express API (login, notes, forum, requests, grades)
public/index.html  front end (single page)
vercel.json        Vercel deployment config
```

**Run locally** (Node.js 18+):

```bash
git clone https://github.com/joaohpf/project-serv.git
cd project-serv
npm install
npm start
```

Open http://localhost:3000.

**API endpoints:** `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/change-password`, `GET/POST/DELETE /api/notes`, `POST /api/forum/:idx/comment`, `GET/POST /api/requests`, `PUT /api/grades`.

> This is a prototype: data lives in memory for each session, and the demo users are defined in `server.js`.

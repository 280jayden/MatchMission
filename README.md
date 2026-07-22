# 🤝 MatchMission

**MatchMission** is a full-stack philanthropic matchmaking web app. It solves choice paralysis in charitable giving by acting as a digital philanthropic advisor, connecting donors to nonprofits they genuinely align with, not a generic directory list.

Generic charity directories list hundreds of organizations with no context, leaving donors to pick arbitrarily or not at all. MatchMission replaces that guesswork with a values-based quiz, an AI-generated weighted cause profile, and transparent, explainable matching against real nonprofit data.

## ✨ Features

* **Personalized Quiz:** A 10-question flow that reads all responses together as one profile, rather than scoring each answer in isolation.
* **AI-Powered Cause Profiling:** GPT-5.5 converts quiz responses into 8 distinct weighted causes (3 core + 5 secondary), with no tied weights, forcing genuine prioritization.
* **Transparent Matching:** Recommendations are ranked with a simple weighted-sum of a user's cause weights against each org's tags. No hidden model at match time, every ranking is explainable.
* **Match Explanations:** Each recommended org includes a plain-language, AI-generated explanation of why it was chosen, grounded in the user's actual answers.
* **Real-Time Recommendation Engine:** Redis sorted sets and `ZUNIONSTORE`/`ZDIFFSTORE` score and filter candidate orgs against a user's weights without recomputing from scratch on every request.
* **Feedback Loop:** Favoriting an org boosts its matching cause weights (capped), so future recommendations improve without any additional API calls.
* **Directory & Filtering:** Browse nonprofits beyond personalized recommendations, filterable by 60+ cause tags from the Every.org API using AND logic.
* **Transparent Finances:** Every org's expanded profile pulls IRS-processed data via the ProPublica API, verified 501(c)(3) status, latest Form 990, executive compensation, and revenue/expense breakdowns rendered as charts.
* **Accounts & Persistence:** Users can register, log in, save favorites, and revisit their generated matches without recomputing them.

## 🛠️ Tech Stack

**Frontend**
* React 19 + TypeScript + Vite
* React Router
* Recharts (radar charts, financial visualizations)

**Backend**
* Flask (Python)
* PostgreSQL + SQLAlchemy (persistent storage: users, nonprofits, profiles)
* Redis (caching + real-time recommendation scoring)
* OpenAI API - `GPT-5.5` for cause profiling, `GPT-4o-mini` for match and weight explanations
* Every.org API (nonprofit data)
* ProPublica API (IRS-verified financial data)

## 📦 Installation & Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
OPENAI_KEY=your_openai_api_key
EVERYORG_KEY=your_everyorg_api_key
REDIS_URL=redis://localhost:6379/0
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=replace_with_a_long_random_secret
```

Run the API:
```bash
python app.py
```

This starts the server in debug mode (auto-reload, in-browser tracebacks on crashes). Alternatively, `flask run --no-debugger` (used by the frontend's `npm run api` script) starts it closer to how it runs in production.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Populating nonprofit data

Before first use, populate the `NonProfits` table from Every.org:
```bash
cd backend
python -m scripts.populate_db
```

## 🗂️ Project Structure

The backend splits into two systems that run in parallel: AI Scoring (Flask + OpenAI, converts quiz answers into weights) and Store & Fetch (Postgres + Every.org + ProPublica, the persistent data layer). Redis sits between them, caching and scoring recommendations in real time.

**Backend**
* `app.py` - Flask app setup, table creation, blueprint registration
* `extensions.py` - SQLAlchemy engine configuration
* `routes/` - `user.py` (auth, profile, results), `quiz.py` (quiz + scoring trigger), `orgs.py` (recommendations, directory, favorites)
* `services/scoring.py` - GPT-5.5 prompt engineering for cause profiling, GPT-4o-mini for match/weight explanations
* `services/fetch_orgs.py` - Every.org API integration, Postgres queries, ProPublica financial data
* `services/redis_cache.py` - Redis-backed recommendation scoring and caching
* `scripts/populate_db.py` - backfills the nonprofit database from Every.org by cause tag

**Frontend**
* `pages/` - Home, Quiz, Results, Directory, Profile, Org detail, Auth pages
* `components/` - reusable UI: org cards, questions, radar chart, tag rendering, loading states
* `components/AuthProvider.tsx` - global auth/session state
* `data/`, `styles/`, `types/` - shared constants, styling, and TypeScript types

## 🗺️ Roadmap / Next Steps

* **More Personalized Options:** Let users retake quizzes or adjust weighted preferences without starting over.
* **Batching Personalized Results:** Load the next batch of recommendations as a user scrolls, instead of a fixed batch.
* **Tracking Donations:** A log on a user's profile of organizations they've actually donated to.
* **Search Feature:** Search the directory directly by organization name.

## 👥 Team

* **Carlos Jusino** - Backend, database
* **Jayden Ramirez** - Backend, API development
* **Kaylee Ulep** - Frontend

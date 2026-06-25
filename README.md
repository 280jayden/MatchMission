
# 🤝 MatchMission

**MatchMission** is a personalized philanthropic matchmaking CLI application. It solves choice paralysis in charitable giving by acting as a digital philanthropic advisor, connecting passionate donors to highly-tailored causes they actually care about.

Generic charity directories list hundreds of organizations without context, leading donors to pick randomly or not at all. MatchMission replaces guesswork with confidence by taking users through a values-based quiz, profiling their philanthropic identity using AI, and matching them with real-world organizations.

## ✨ Features

* **Interactive CLI Quiz:** A fast, 10-question terminal survey to discover a user's core values, demographic focuses, and preferred impact methods.
* **AI-Powered Donor Profiling:** Utilizes Google's Gemini 2.5 Flash to analyze quiz responses and generate a mathematically weighted donor profile (Core Causes & Secondary Modifiers).
* **Live API Integration:** Dynamically fetches top-rated, relevant 501(c)(3) nonprofits directly from the Every.org API based on the user's AI profile.
* **Smart Matching Algorithm:** Scores the fetched candidates against the user's weighted profile (10 points for core causes, 7 points for secondary) to output the Top 5 perfect matches.

## 🛠️ Tech Stack

* **Language:** Python 3.x
* **AI/LLM:** Google GenAI SDK | Gemini API (`gemini-2.5-flash`)
* **External API:** Every.org API
* **Data Handling:** Pandas
* **Environment Management:** `python-dotenv`
* **Database:** SQLite3, SQLAlchemy

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone [https://github.com/yourusername/MatchMission.git](https://github.com/yourusername/MatchMission.git)
cd MatchMission

2. **Set up a virtual environment (Recommended)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```



3. **Install dependencies**
Before running the project, ensure you have the required Python packages installed.

You can install them using the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

Or install them manually:
```bash
pip install pandas python-dotenv google-genai requests sqlalchemy
```
The project requires:
* pandas
* python-dotenv
* google-genai
* requests
* sqlalchemy



4. **Environment Variables**
Create a `.env` file in the root directory of the project. **Never commit this file to GitHub.** Add your API keys:
```env
GENAI_KEY=your_google_gemini_api_key_here
EVERYORG_KEY=your_every_org_api_key_here
```


## 🚀 Usage

Run the main orchestrator to start the interactive quiz and matching process:

```bash
python main.py

```

The application will:

1. Greet you and launch the 10-question MatchMission quiz.
2. Send your responses to Gemini to generate a weighted JSON profile.
3. Query the Every.org API for nonprofits matching your top tags.
4. Process the candidate results.
5. Calculate your personalized match scores and display your Top 5 nonprofits.

## 🗂️ Project Structure

* `main.py` - The central orchestrator that ties the quiz, APIs, and scoring together.
* `questions.py` - Contains the survey logic and question data structure.
* `scoring.py` - Handles the prompt engineering and JSON generation via the Google GenAI SDK.
* `fetch_orgs.py` - Manages API requests to Every.org and formats the results using Pandas.

## 🗺️ Roadmap / Next Steps

* **AI Explanations:** Pass the Top 5 matches back into an LLM to generate personalized, plain-language explanations of *why* the nonprofit fits the user.
* **Swiping UI:** Transition from a CLI tool to a graphical interface featuring left/right swiping cards for easier nonprofit discovery.
* **User Accounts:** Allow users to save their matches, track their donations, and skip the quiz on returning visits.


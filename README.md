# Call Center Reviews Egypt

A community-driven platform where current and former employees can anonymously share honest workplace experiences about call center, outsourcing, and BPO companies in Egypt.

The goal of the project is to make job searching more transparent by giving applicants access to real employee reviews before accepting an offer.

Unlike global platforms such as Blind or Glassdoor, this project focuses specifically on the Egyptian call center and BPO industry.

---

## Why this project?

Finding honest information about employers in Egypt is surprisingly difficult. Most applicants rely on Facebook groups, Reddit threads, or word of mouth, where information is scattered, outdated, and difficult to verify.

This project collects anonymous employee reviews in one place and makes them organized and easy to compare.

---

## Features

Current features include:

- Company directory (homepage)
- Individual company pages
- Anonymous employee reviews, collected via an invite-only Google Form
- Company ratings on a 1–10 scale
- Rating distribution chart per company
- Company logos
- Long review text truncation ("See more" / "See less")
- Arabic (default) and English support, with full right-to-left layout switching
- Dark (default) and Light themes
- Responsive design
- Google Forms review collection
- Automatic JSON generation using Google Apps Script
- Automatic data refresh every 10 minutes using GitHub Actions

---

## Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend**
- Google Forms
- Google Sheets
- Google Apps Script

**Automation**
- GitHub Actions

**Hosting**
- GitHub Pages

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── update-data.yml
├── assets/
│   └── logos/
├── css/
│   └── style.css
├── js/
│   ├── i18n.js
│   ├── script.js
│   └── company.js
├── data.json
├── favicon.svg
├── index.html
├── company.html
└── README.md
```

---

## How it works

1. An employee submits an anonymous review through an invite-only Google Form.
2. Responses are stored in Google Sheets.
3. Google Apps Script converts the spreadsheet into structured JSON, renaming spreadsheet columns into clean field names.
4. A scheduled GitHub Actions workflow fetches that JSON every 10 minutes and commits it to the repository as `data.json`.
5. GitHub Pages serves the site, which reads `data.json` directly — no live API calls, no database or backend server required.

---

## Current Roadmap

### Phase 1
- ✅ Homepage
- ✅ Company pages
- ✅ Review system
- ✅ Ratings (1–10 scale) and rating distribution
- ✅ Arabic / English support
- ✅ Dark / Light themes
- ✅ Company logos

### Phase 2
- Search
- Filters
- Further UI polish
- Trending companies

### Phase 3
- Salary insights
- Category ratings (management, training, work-life balance)
- Career growth score

### Future
- AI-generated company summaries
- Interview experiences
- Verified employees
- Company comparisons
- Mobile application

---

## Vision

This project is intended to become the Egyptian equivalent of platforms like Blind and Glassdoor, focused specifically on the needs of the local call center and BPO job market. Future versions may include richer analytics, salary insights, and AI-powered summaries generated from employee reviews.

---

## Contributing

Contributions, suggestions, and feedback on the code are welcome. If you find a bug or have an idea for a feature, feel free to open an Issue or submit a Pull Request.

Note: review submissions themselves are currently collected through an invite-only form and are not open to the public.

---

## License

This project is released under the MIT License.

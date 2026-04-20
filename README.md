# UN Votes

UN General Assembly and Security Council voting data pipeline and web viewer.

## Structure

- `web/`: TanStack Start frontend
- `data/notebooks/`: data prep notebooks
- `data/live/`: processed JSON outputs used by the app
- `data/un_dl/`: local UN Digital Library source CSVs (not committed)

## Prerequisites

- Node.js 22+
- Python 3.11+

## Web app

```bash
cd web
npm install
npm run dev
```

Build:

```bash
cd web
npm run build
```

## Data files required locally

Archive CSV files are not in this repo because they are too large.

Download these files from the UN Digital Library and place them in `data/un_dl/`:

- `2026_02_06_ga_voting.csv` (`GA_FILE`)
- `2026_02_06_sc_voting.csv` (`SC_FILE`)
- `member_states_auths_2025-12-02_rev-1.csv` (`MS_FILE`)

These names match `data/notebooks/grab_un_dl_data.ipynb`.

## Regenerate GA archive JSON

Run `data/notebooks/grab_un_dl_data.ipynb` to rebuild:

- `data/live/ga_archive.json`

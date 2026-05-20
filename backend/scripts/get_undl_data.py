import pandas as pd
from pathlib import Path
import re
from typing import Any

pd.set_option("display.max_colwidth", None)
pd.set_option("display.max_rows", None)

UN_DL_DIR = Path.cwd() / "data" / "undl"
GA_FILE = UN_DL_DIR / "2026_02_06_ga_voting.csv"
SC_FILE = UN_DL_DIR / "2026_02_06_sc_voting.csv"
MS_FILE = UN_DL_DIR / "member_states_auths_2025-12-02_rev-1.csv"


def build_votes_dict(group):
    votes = {}
    for _, row in group.iterrows():
        ms_name = row["ms_name"]
        if pd.isna(ms_name):
            continue
        v = str(row["ms_vote"]).strip().upper()
        if v in {"Y", "YES"}:
            votes[ms_name] = "yes"
        elif v in {"N", "NO"}:
            votes[ms_name] = "no"
        elif v in {"A", "ABSTAIN", "ABSTENTION"}:
            votes[ms_name] = "abstain"
        else:
            votes[ms_name] = "not-voting"
    return votes


def process_ga():
    df = pd.read_csv(GA_FILE, dtype=str)
    # Convert numerical columns from strings
    for col in ["total_yes", "total_no", "total_abstentions"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    df["title"] = [str(x).split(": resolution")[0].strip() for x in df["title"]]

    group_cols = ["undl_id", "date", "session", "resolution", "title", "subjects", "total_yes", "total_no", "total_abstentions"]

    grouped_records = []
    for keys, group in df.groupby(group_cols, dropna=False):
        record = dict(zip(group_cols, keys))
        
        # Build structure matching frontend Resolution interface
        res = {
            "id": record["resolution"],
            "date": record["date"],
            "body": "GA",
            "title": record["title"],
            "session": record["session"],
            "votes": build_votes_dict(group),
            "summary": {
                "yes": int(record["total_yes"]),
                "no": int(record["total_no"]),
                "abstain": int(record["total_abstentions"])
            },
            "subjects": record.get("subjects")
        }
        
        # Calculate result
        if res["summary"]["yes"] > res["summary"]["no"]:
            res["result"] = "Adopted"
        elif res["summary"]["yes"] == 0 and res["summary"]["no"] == 0 and res["summary"]["abstain"] == 0:
            res["result"] = "Adopted" # consensus
        else:
            res["result"] = "Rejected"
            
        grouped_records.append(res)

    df_grouped = pd.DataFrame(grouped_records)

    out_dir = Path.cwd() / "data" / "live"
    out_dir.mkdir(exist_ok=True)
    df_grouped.to_json(out_dir / "ga_archive.json", orient="records", indent=4)
    print("GA processing complete.")


def process_sc():
    df = pd.read_csv(SC_FILE, dtype=str)
    
    # Convert numerical columns
    for col in ["total_yes", "total_no", "total_abstentions"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)
        
    df["permanent_member"] = df["permanent_member"] == "True"

    df = df.rename(columns={"description": "title"})

    def clean_sc_title(x):
        x_str = str(x)
        match = re.search(r"\[on (.+?)\]", x_str)
        if match:
            return match.group(1).strip()
        return x_str.strip()

    df["title"] = df["title"].apply(clean_sc_title)

    group_cols = ["undl_id", "date", "resolution", "title", "subjects", "total_yes", "total_no", "total_abstentions"]

    grouped_records = []
    for keys, group in df.groupby(group_cols, dropna=False):
        record = dict(zip(group_cols, keys))
        
        res = {
            "id": record["resolution"],
            "date": record["date"],
            "body": "SC",
            "title": record["title"],
            "session": str(record["date"])[:4] if pd.notna(record["date"]) else "",
            "votes": build_votes_dict(group),
            "summary": {
                "yes": int(record["total_yes"]),
                "no": int(record["total_no"]),
                "abstain": int(record["total_abstentions"])
            },
            "subjects": record.get("subjects")
        }
        
        # Calculate result for SC
        is_vetoed = False
        for _, row in group.iterrows():
            if row.get("permanent_member") and str(row.get("ms_vote")).strip().upper() in {"N", "NO"}:
                is_vetoed = True
                break
                
        if is_vetoed:
            res["result"] = "Vetoed"
        elif res["summary"]["yes"] >= 9:
            res["result"] = "Adopted"
        else:
            res["result"] = "Rejected"
            
        grouped_records.append(res)

    df_grouped = pd.DataFrame(grouped_records)

    out_dir = Path.cwd() / "data" / "live"
    out_dir.mkdir(exist_ok=True)
    df_grouped.to_json(out_dir / "sc_archive.json", orient="records", indent=4)
    print("SC processing complete.")


if __name__ == "__main__":
    process_ga()
    process_sc()

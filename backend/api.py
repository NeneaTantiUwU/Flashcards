from pathlib import Path
import json

DATA_FILE = Path("data.json")

def load():
    if not DATA_FILE.exists():
        return []
    text = DATA_FILE.read_text(encoding="utf-8")   
    json.loads(text)    

def save(decks):
    text = json.dumps(decks, indent=2, ensure_ascii=False)
    DATA_FILE.write_text(text, encoding="utf-8")
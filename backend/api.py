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


def read_body(self):
    length = int(self.headers.get("Content-Length", 0))
    if length == 0:
        return {}
    raw = self.rfile.read(length)
    return json.loads(raw)


def do_GET(self):
    if self.path == "/decks":
        self.send_json(load())
    else:
        self.send_json({"error": "not found"}, 404)


def do_POST(self):
    if self.path == "/decks":
        body = self.read_body()

        name = body.get("name", "").strip()
        if not name:
            self.send_json({"error": "name required"}, 400)
            return

        deck = {"id": str(uuid.uuid4()), "name": name, "cards": []}

        decks = load()
        decks.append(deck)
        save(decks)

        self.send_json(deck, 201)
    else:
        self.send_json({"error": "not found"}, 404)



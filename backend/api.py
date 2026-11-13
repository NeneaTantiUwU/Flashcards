from pathlib import Path
import json
import uuid
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import date, timedelta

DATA_FILE = Path("data.json")

def load():
    if not DATA_FILE.exists():
        return []
    text = DATA_FILE.read_text(encoding="utf-8")   
    return json.loads(text)    


def save(decks):
    text = json.dumps(decks, indent=2, ensure_ascii=False)
    DATA_FILE.write_text(text, encoding="utf-8")


class Handler(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_cors()
        self.end_headers()
        self.wfile.write(body)

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")


    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors()
        self.end_headers()


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
        parts = self.path.split("/")

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

        elif len(parts) == 4 and parts[1] == "decks" and parts[3] == "cards":
            deck_id = parts[2]
            body = self.read_body()
            front = body.get("front", "").strip()
            back = body.get("back", "").strip()

            if not front or not back:
                self.send_json({"error": "not found"}, 404)
                return
            decks = load()
            deck = next((d for d in decks if d["id"] == deck_id), None)

            if deck is None:
                self.send_json({"error": "deck not found"}, 404)
                return

            card = {
                "id": str(uuid.uuid4()),
                "front": front,
                "back": back,
                "interval": 0,
                "dueDate": date.today().isoformat(),
            }
            deck["cards"].append(card)
            save(decks)

            self.send_json(card, 201)

        elif len(parts) == 4 and parts[1] == "cards" and parts[3] == "review":
            card_id = parts[2]
            body = self.read_body()

            rating = body.get("rating")
            if rating not in ("hard", "ok", "easy"):
                self.send_json({"error": "rating must be hard, ok or easy"}, 400)   
                return 

            decks = load()
            card = None
            for deck in decks:
                for c in deck["cards"]:
                    if c["id"] == card_id:
                        card = c
                        break
                    if card:
                        break

                if card is None:
                    self.send_json({"error": "card not found"}, 404)
                    return

                if rating == "hard":
                    card["interval"] = 1
                elif rating == "ok":
                    card["interval"] = max(1, card["interval"] * 2)
                else:
                    card["interval"] = max(3, card["interval"] * 3)

                card["dueDate"] = (date.today() + timedelta(days=card["interval"])).isoformat()

                save(decks)
                self.send_json(card)

        else:
            self.send_json({"error": "not found"}, 404)

            


    def do_DELETE(self):
        parts = self.path.split("/")

        if len(parts) == 3 and parts[1] == "decks":
            deck_id = parts[2]

            decks = load()
            new_decks = [d for d in decks if d["id"] != deck_id]

            if len(new_decks) == len(decks):
                self.send_json({"error": "deck not found"}, 404)
                return

            save(new_decks)
            self.send_json({"ok": True})

        elif len(parts) == 3 and parts[1] == "cards":
            card_id = parts[2]

            decks = load()
            found = False
            for deck in decks:
                new_cards = [c for c in deck["cards"] if c["id"] != card_id]
                if len(new_cards) != len(deck["cards"]):
                   deck["cards"] = new_cards
                   found = True
                   break

            if not found:
                self.send_json({"error": "card not found"}, 404)
                return

            save(decks)
            self.send_json({"ok": True})

        else:
            self.send_json({"error": "not found"}, 404)
            


if __name__ == "__main__":
    print("Server running on http://localhost:5000")
    HTTPServer(("localhost", 5000), Handler).serve_forever()

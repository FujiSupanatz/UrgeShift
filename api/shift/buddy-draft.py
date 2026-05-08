from http.server import BaseHTTPRequestHandler

from api._shift_logic import llm_buddy_draft, read_json, send_json


class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_POST(self):
        payload = read_json(self)
        send_json(
            self,
            {
                "draft": llm_buddy_draft(payload),
                "source": "typhoon-python-stateless",
            },
        )

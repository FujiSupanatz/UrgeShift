from http.server import BaseHTTPRequestHandler

from api._shift_logic import llm_crisis_status, read_json, send_json


class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_POST(self):
        payload = read_json(self)
        send_json(
            self,
            {
                "status": llm_crisis_status(payload.get("text")),
                "source": "typhoon-python-stateless",
            },
        )

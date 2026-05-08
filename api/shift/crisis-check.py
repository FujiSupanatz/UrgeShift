from http.server import BaseHTTPRequestHandler

try:
    from api._shift_logic import llm_crisis_status, read_json, send_json
except ModuleNotFoundError:
    import importlib.util
    from pathlib import Path

    _LOGIC_PATH = Path(__file__).resolve().parents[1] / "_shift_logic.py"
    _SPEC = importlib.util.spec_from_file_location("urgeshift_shift_logic", _LOGIC_PATH)
    _MODULE = importlib.util.module_from_spec(_SPEC)
    assert _SPEC and _SPEC.loader
    _SPEC.loader.exec_module(_MODULE)
    llm_crisis_status = _MODULE.llm_crisis_status
    read_json = _MODULE.read_json
    send_json = _MODULE.send_json


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

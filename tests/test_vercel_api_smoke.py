import importlib
import importlib.util
from pathlib import Path
import unittest


class VercelApiSmokeTest(unittest.TestCase):
    def load_module_from_path(self, name, relative_path):
        file_path = Path(__file__).resolve().parents[1] / relative_path
        spec = importlib.util.spec_from_file_location(name, file_path)
        module = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(module)
        return module

    def test_python_api_modules_import(self):
        imported = [
            importlib.import_module("api._shift_logic"),
            self.load_module_from_path("recommend_handler", "api/shift/recommend.py"),
            self.load_module_from_path("buddy_draft_handler", "api/shift/buddy-draft.py"),
            self.load_module_from_path("crisis_check_handler", "api/shift/crisis-check.py"),
        ]

        for module in imported[1:]:
            self.assertTrue(hasattr(module, "handler"))

    def test_shift_logic_behaves_for_basic_signals(self):
        logic = importlib.import_module("api._shift_logic")

        first = logic.choose_action({"event": "start"})
        harm = logic.choose_action({"event": "anyway"})
        crisis = logic.llm_crisis_status("I can't stay safe")

        self.assertEqual(first["mode"], logic.ACTIONS["first"]["mode"])
        self.assertEqual(harm["mode"], logic.ACTIONS["harm"]["mode"])
        self.assertEqual(crisis, "crisis")


if __name__ == "__main__":
    unittest.main()

"""
Syntax error detector — rule-based validation with intelligent suggestions.
"""

from app.compiler.lexical.tokens import Token


class SyntaxErrorDetector:
    """Detects syntax errors in source using line rules and token patterns."""

    def detect(self, tokens: list[Token], source: str) -> list[dict]:
        errors: list[dict] = []
        lines = source.split("\n")

        for line_num, line in enumerate(lines, start=1):
            stripped = line.strip()
            if not stripped or stripped.startswith("//"):
                continue

            if stripped.startswith(("int ", "float ", "void ")):
                if not stripped.endswith(";"):
                    if "=" in stripped:
                        msg = "Expected ';' after declaration"
                        sug = f"Add a semicolon at the end of line {line_num}: {stripped};"
                    else:
                        msg = "Expected ';' after variable declaration"
                        sug = f"Add a semicolon: {stripped};"
                    errors.append(
                        {
                            "line": line_num,
                            "column": len(line.rstrip()) + 1,
                            "message": msg,
                            "suggestion": sug,
                            "severity": "error",
                        }
                    )

            if stripped.startswith("print(") and not stripped.endswith(");"):
                if not stripped.endswith(")"):
                    errors.append(
                        {
                            "line": line_num,
                            "column": 1,
                            "message": "Unclosed parenthesis in print statement",
                            "suggestion": "Close the print call: print(...);",
                            "severity": "error",
                        }
                    )
                elif not stripped.endswith(";"):
                    errors.append(
                        {
                            "line": line_num,
                            "column": len(stripped),
                            "message": "Expected ';' after print statement",
                            "suggestion": f"Add semicolon: {stripped};",
                            "severity": "error",
                        }
                    )

        if tokens:
            last = tokens[-1]
            if last.type == "OPERATOR":
                errors.append(
                    {
                        "line": last.line,
                        "column": last.column,
                        "message": "Incomplete expression — missing operand",
                        "suggestion": "Provide a value or identifier after the operator",
                        "severity": "warning",
                    }
                )

        return errors

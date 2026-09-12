#!/usr/bin/env python3
"""Convert physical Tailwind direction utilities to logical equivalents."""

from __future__ import annotations

import re
from pathlib import Path

ROOTS = [Path("app"), Path("components")]
SUFFIXES = {".tsx", ".ts", ".jsx", ".js", ".css"}

TOKEN = re.compile(
    r'(?<![\w-])'
    r'((?:(?:!|md|sm|lg|xl|2xl|max-md|max-lg|max-sm|max-xl|hover|focus|'
    r'focus-within|group-hover|dark|data-\[[^\]]+\]|aria-\[[^\]]+\]):)*)'
    r'(!?)('
    r'text-left|text-right|'
    r'ml-[^\s"\'`]+|mr-[^\s"\'`]+|pl-[^\s"\'`]+|pr-[^\s"\'`]+|'
    r'left-[^\s"\'`]+|right-[^\s"\'`]+|'
    r'border-l(?:-[^\s"\'`]+)?|border-r(?:-[^\s"\'`]+)?|'
    r'rounded-tl(?:-[^\s"\'`]+)?|rounded-tr(?:-[^\s"\'`]+)?|'
    r'rounded-bl(?:-[^\s"\'`]+)?|rounded-br(?:-[^\s"\'`]+)?|'
    r'rounded-l-[^\s"\'`]+|rounded-r-[^\s"\'`]+|'
    r'scroll-m[lr]-[^\s"\'`]+|scroll-p[lr]-[^\s"\'`]+|'
    r'inset-[lr](?:-[^\s"\'`]+)?'
    r')'
    r'(?=[\s"\'`}]|$)'
)

SKIP_BASE = {
    "left-1/2",
    "right-1/2",
}


def map_base(base: str) -> str | None:
    if base in SKIP_BASE:
        return None
    if "to-right" in base or "to-left" in base:
        return None
    if base.startswith("right-hand"):
        return None

    if base == "text-left":
        return "text-start"
    if base == "text-right":
        return "text-end"

    if base.startswith("ml-"):
        return "ms-" + base[3:]
    if base.startswith("mr-"):
        return "me-" + base[3:]
    if base.startswith("pl-"):
        return "ps-" + base[3:]
    if base.startswith("pr-"):
        return "pe-" + base[3:]

    if base.startswith("scroll-ml-"):
        return "scroll-ms-" + base[9:]
    if base.startswith("scroll-mr-"):
        return "scroll-me-" + base[9:]
    if base.startswith("scroll-pl-"):
        return "scroll-ps-" + base[9:]
    if base.startswith("scroll-pr-"):
        return "scroll-pe-" + base[9:]

    if base.startswith("left-"):
        return "start-" + base[5:]
    if base.startswith("right-"):
        return "end-" + base[6:]

    if base.startswith("rounded-tl"):
        return "rounded-ss" + base[10:]
    if base.startswith("rounded-tr"):
        return "rounded-se" + base[10:]
    if base.startswith("rounded-bl"):
        return "rounded-es" + base[10:]
    if base.startswith("rounded-br"):
        return "rounded-ee" + base[10:]
    if base.startswith("rounded-l-"):
        return "rounded-s-" + base[9:]
    if base.startswith("rounded-r-"):
        return "rounded-e-" + base[9:]

    if base == "border-l":
        return "border-s"
    if base.startswith("border-l-"):
        return "border-s-" + base[9:]
    if base == "border-r":
        return "border-e"
    if base.startswith("border-r-"):
        return "border-e-" + base[9:]

    if base == "inset-l":
        return "inset-s"
    if base.startswith("inset-l-"):
        return "inset-s-" + base[8:]
    if base == "inset-r":
        return "inset-e"
    if base.startswith("inset-r-"):
        return "inset-e-" + base[8:]

    return None


def main() -> None:
    count_map: dict[str, int] = {}
    file_changes = 0
    token_changes = 0
    examples: list[str] = []

    for root in ROOTS:
        for path in root.rglob("*"):
            if path.suffix not in SUFFIXES:
                continue
            text = path.read_text(errors="ignore")

            def repl(m: re.Match[str]) -> str:
                nonlocal token_changes
                variants, bang, base = m.group(1), m.group(2), m.group(3)
                mapped = map_base(base)
                if mapped is None:
                    return m.group(0)
                token_changes += 1
                old = bang + base
                new = bang + mapped
                key = f"{old}→{new}"
                count_map[key] = count_map.get(key, 0) + 1
                return f"{variants}{new}"

            new_text = TOKEN.sub(repl, text)
            if new_text != text:
                path.write_text(new_text)
                file_changes += 1
                if len(examples) < 20:
                    examples.append(str(path))

    print(f"files changed: {file_changes}")
    print(f"token changes: {token_changes}")
    print("top mappings:")
    for key, n in sorted(count_map.items(), key=lambda x: -x[1])[:50]:
        print(f"  {n:3}  {key}")
    print("examples:", ", ".join(examples))


if __name__ == "__main__":
    main()

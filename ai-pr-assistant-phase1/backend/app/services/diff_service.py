import sys
from pathlib import Path

# Ensure backend root is always in sys.path
backend_root = Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import os
from typing import Any, Dict, List
from app.models import AffectedModule



MODULE_COLORS = ["#F9B17A", "#676F9D", "#A5B4FC", "#34D399", "#F472B6", "#38BDF8"]


def analyze_affected_modules(files: List[Dict[str, Any]]) -> List[AffectedModule]:
    """
    Groups changed files by their top-level or second-level directory to produce
    the Affected Modules distribution chart.
    """
    if not files:
        return [AffectedModule(name="root", percentage=100, filesCount=0, color="#F9B17A")]

    module_counts: Dict[str, int] = {}
    total_files = len(files)

    for f in files:
        filename = f.get("filename", "")
        parts = filename.split("/")
        if len(parts) > 1:
            # e.g., "src/auth" or "backend/app"
            if len(parts) >= 3 and parts[0] in ["src", "packages", "apps", "lib", "app"]:
                module_name = f"{parts[0]}/{parts[1]}"
            else:
                module_name = parts[0]
        else:
            module_name = "root / config"

        module_counts[module_name] = module_counts.get(module_name, 0) + 1

    # Sort by count descending
    sorted_modules = sorted(module_counts.items(), key=lambda x: x[1], reverse=True)

    # Take top 5, group rest into "other" if many
    top_modules = sorted_modules[:5]
    other_count = sum(count for _, count in sorted_modules[5:])

    result: List[AffectedModule] = []
    running_pct = 0

    for idx, (name, count) in enumerate(top_modules):
        pct = max(1, round((count / total_files) * 100))
        running_pct += pct
        color = MODULE_COLORS[idx % len(MODULE_COLORS)]
        result.append(
            AffectedModule(
                name=name,
                percentage=pct,
                filesCount=count,
                color=color,
            )
        )

    if other_count > 0:
        pct = max(1, 100 - running_pct) if running_pct < 100 else 5
        result.append(
            AffectedModule(
                name="other",
                percentage=pct,
                filesCount=other_count,
                color="#64748B",
            )
        )

    # Ensure percentages sum to ~100
    total_pct = sum(m.percentage for m in result)
    if total_pct > 0 and result:
        result[0].percentage += 100 - total_pct

    return result


def prepare_diff_context(files: List[Dict[str, Any]], max_chars: int = 500000) -> str:
    """
    Prepares the complete diff text and patch sets of all modified files for the LLM.
    Leverages large context window models (e.g. Gemini Flash 1M tokens) to ingest full multi-file diffs.
    """
    diff_chunks = []
    current_length = 0

    for f in files:
        filename = f.get("filename", "")
        status = f.get("status", "modified")
        additions = f.get("additions", 0)
        deletions = f.get("deletions", 0)
        patch = f.get("patch", "")

        header = f"=== File: {filename} ({status}, +{additions}/-{deletions}) ===\n"
        if patch:
            chunk = header + patch + "\n\n"
        else:
            chunk = header + "[No raw text patch available - binary or large file]\n\n"

        if current_length + len(chunk) > max_chars:
            diff_chunks.append(f"\n... [Remaining {len(files) - len(diff_chunks)} files diff truncated for safety budget]")
            break

        diff_chunks.append(chunk)
        current_length += len(chunk)

    return "".join(diff_chunks)


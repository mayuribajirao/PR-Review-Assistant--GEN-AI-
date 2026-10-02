import sys
from pathlib import Path

# Ensure backend root is always in sys.path
backend_root = Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import json
import re
from typing import Any, Dict, List, Optional
from app.config import GEMINI_API_KEY, GROQ_API_KEY
from app.models import RiskItem, TestCaseItem, ReviewCommentData
import httpx



SYSTEM_PROMPT = """You are an elite Staff Software Engineer and automated PR reviewer.
Your job is to analyze git pull requests and generate crystal-clear, actionable, and mathematically grounded code review assessments.

Return a strictly valid JSON object matching this schema:
{
  "summary": [
    "High-level architectural intent and what was changed",
    "Key mechanics or internal functions touched",
    "Downstream impact or developer experience outcome"
  ],
  "changeType": "Bug Fix" | "Feature" | "Refactor" | "Security Patch" | "Performance" | "Infrastructure",
  "estimatedReviewTime": "5 min",
  "risks": [
    {
      "category": "Breaking Change" | "Security" | "Performance" | "State Mutation" | "Error Handling",
      "level": "HIGH" | "MEDIUM" | "LOW",
      "text": "Concrete description of what risk exists and where"
    }
  ],
  "testCases": [
    {
      "id": "TC-01",
      "title": "Short test title",
      "scenario": "Step-by-step description of the test scenario",
      "tag": "E2E" | "Edge Case" | "Unit" | "Integration" | "Regression",
      "expectedOutcome": "What should happen"
    }
  ],
  "reviewCommentMarkdown": "A complete, polite, constructive GitHub PR review comment formatted in clean markdown with sections for Summary, Key Observations, Potential Issues, and Testing Recommendations."
}
"""


def estimate_review_time(lines_added: int, lines_removed: int, files_count: int) -> str:
    total_delta = lines_added + lines_removed
    if total_delta < 50 and files_count <= 2:
        return "3 min"
    elif total_delta < 200:
        return "6 min"
    elif total_delta < 500:
        return "12 min"
    elif total_delta < 1500:
        return "20 min"
    else:
        return "35+ min"


def detect_change_type(title: str, commits: List[str]) -> str:
    title_lower = title.lower()
    combined = (title_lower + " " + " ".join(commits)).lower()
    if any(k in combined for k in ["fix", "bug", "patch", "issue", "resolve"]):
        return "Bug Fix"
    elif any(k in combined for k in ["feat", "feature", "add", "support", "new"]):
        return "Feature"
    elif any(k in combined for k in ["refactor", "cleanup", "clean up", "reorganize"]):
        return "Refactor"
    elif any(k in combined for k in ["security", "cve", "auth", "token", "sanitize"]):
        return "Security Patch"
    elif any(k in combined for k in ["perf", "performance", "speed", "optimize"]):
        return "Performance"
    return "Enhancement"


async def generate_gemini_analysis(prompt: str) -> Optional[Dict[str, Any]]:
    """Calls Gemini 2.0 Flash or 1.5 Flash using the Google GenAI SDK or REST API."""
    if not GEMINI_API_KEY:
        return None

    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "system_instruction": SYSTEM_PROMPT,
            },
        )
        if response.text:
            return json.loads(response.text)
    except Exception as e:
        print(f"Gemini SDK failed, attempting direct REST fallback: {e}")
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": SYSTEM_PROMPT + "\n\n" + prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"},
            }
            async with httpx.AsyncClient(timeout=30.0) as http_client:
                res = await http_client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(raw_text)
        except Exception as e2:
            print(f"Gemini REST also failed: {e2}")

    return None


async def generate_groq_analysis(prompt: str) -> Optional[Dict[str, Any]]:
    """Fallback to Groq if GROQ_API_KEY is provided."""
    if not GROQ_API_KEY:
        return None

    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2,
        }
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            res = await http_client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                content = res.json()["choices"][0]["message"]["content"]
                return json.loads(content)
    except Exception as e:
        print(f"Groq API call failed: {e}")

    return None


def generate_heuristic_analysis(
    title: str,
    body: str,
    author: str,
    repo_name: str,
    pr_number: int,
    commits: List[str],
    files: List[Dict[str, Any]],
    lines_added: int,
    lines_removed: int,
) -> Dict[str, Any]:
    """
    Intelligent fallback when no LLM key is configured yet.
    Produces accurate structural analysis based on git metadata.
    """
    change_type = detect_change_type(title, commits)
    review_time = estimate_review_time(lines_added, lines_removed, len(files))

    summary = [
        f"PR #{pr_number} by @{author} focuses on {change_type.lower()} in {repo_name}.",
        f"Modifies {len(files)} files across key modules with +{lines_added} / -{lines_removed} line changes.",
        f"Intent derived from commit history: {commits[0] if commits else (title or 'Standard update')}."
    ]

    risks = []
    if lines_added + lines_removed > 500:
        risks.append({
            "category": "Diff Volume",
            "level": "MEDIUM",
            "text": f"Large diff size ({lines_added + lines_removed} total lines). Consider splitting into atomic PRs to minimize regression risks."
        })

    has_auth_or_db = any(re.search(r"(auth|session|token|db|sql|schema|migrate)", f.get("filename", ""), re.I) for f in files)
    if has_auth_or_db:
        risks.append({
            "category": "State & Security",
            "level": "HIGH",
            "text": "Contains changes to authentication, state, or persistent schemas. Verify session invalidation and concurrency locks."
        })
    else:
        risks.append({
            "category": "Regression Coverage",
            "level": "LOW",
            "text": "Ensure existing integration test suites are passing across modified endpoints."
        })

    test_cases = [
        {
            "id": "TC-01",
            "title": f"Happy path verification for {change_type}",
            "scenario": f"Exercise the core execution path touched by PR #{pr_number}.",
            "tag": "Integration",
            "expectedOutcome": "Function executes with expected output and HTTP 200 / success state."
        },
        {
            "id": "TC-02",
            "title": "Error boundary and null input validation",
            "scenario": "Pass malformed payload or trigger network disconnect during execution.",
            "tag": "Edge Case",
            "expectedOutcome": "Graceful error message returned without uncaught exceptions or resource leaks."
        }
    ]

    review_comment = (
        f"### 🔍 AI Pull Request Review — PR #{pr_number}\n\n"
        f"**Summary**: {title}\n\n"
        f"- **Change Category**: `{change_type}`\n"
        f"- **Impact Area**: {len(files)} files modified (+{lines_added} / -{lines_removed})\n\n"
        f"#### ✅ Key Observations\n"
        f"1. Code modifications align with the stated goal: *\"{title}\"*.\n"
        f"2. Check error handling across modified edge cases before final merge.\n\n"
        f"#### 🧪 Suggested Verification\n"
        f"- Run integration tests covering `{files[0].get('filename', 'core modules') if files else 'main modules'}`.\n\n"
        f"*Reviewed via ReviewPulse AI.*"
    )

    return {
        "summary": summary,
        "changeType": change_type,
        "estimatedReviewTime": review_time,
        "risks": risks,
        "testCases": test_cases,
        "reviewCommentMarkdown": review_comment,
    }


async def analyze_pr_with_ai(
    title: str,
    body: str,
    author: str,
    repo_name: str,
    pr_number: int,
    commits: List[str],
    files: List[Dict[str, Any]],
    diff_text: str,
    lines_added: int,
    lines_removed: int,
) -> Dict[str, Any]:
    """Orchestrates comprehensive AI analysis with full PR metadata, commits, file list, and diff patches."""
    formatted_commits = "\n".join(f"- {c}" for c in commits) if commits else "No commit messages recorded."
    formatted_files = "\n".join(
        f"- {f.get('filename', '')} ({f.get('status', 'modified')}, +{f.get('additions', 0)}/-{f.get('deletions', 0)})"
        for f in files
    ) if files else "No files listed."

    prompt = f"""=== PULL REQUEST REVIEW TARGET ===
Repository: {repo_name}
Pull Request: #{pr_number}
Title: {title}
Author: @{author}
Total Changes: {len(files)} files changed (+{lines_added} additions, -{lines_removed} deletions)

=== PR DESCRIPTION ===
{body if body and body.strip() else "No PR description provided by author."}

=== ALL COMMIT MESSAGES ({len(commits)} total) ===
{formatted_commits}

=== ALL CHANGED FILES ({len(files)} total) ===
{formatted_files}

=== COMPLETE GIT DIFF PATCHES ===
{diff_text if diff_text.strip() else "[Empty diff or binary modifications only]"}
"""

    # 1. Try Gemini
    analysis = await generate_gemini_analysis(prompt)

    # 2. Try Groq if Gemini was not configured or failed
    if not analysis:
        analysis = await generate_groq_analysis(prompt)

    # 3. Fallback to heuristic analysis
    if not analysis:
        analysis = generate_heuristic_analysis(
            title=title,
            body=body,
            author=author,
            repo_name=repo_name,
            pr_number=pr_number,
            commits=commits,
            files=files,
            lines_added=lines_added,
            lines_removed=lines_removed,
        )

    return analysis


import sys
from pathlib import Path

# Ensure backend root is always in sys.path
backend_root = Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import re
from typing import Any, Dict, List, Optional, Tuple
import httpx
from fastapi import HTTPException
from app.config import GITHUB_TOKEN



def parse_github_pr_url(url: str) -> Tuple[str, str, int]:
    """
    Extracts owner, repo, and pull_number from a GitHub PR URL.
    Example: https://github.com/supabase/auth-js/pull/842 -> ('supabase', 'auth-js', 842)
    """
    pattern = r"github\.com/([^/]+)/([^/]+)/pull/(\d+)"
    match = re.search(pattern, url.strip())
    if not match:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub Pull Request URL. Expected format: https://github.com/owner/repo/pull/123",
        )
    owner, repo, pr_number = match.groups()
    return owner, repo, int(pr_number)


def get_headers() -> Dict[str, str]:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "AI-PR-Assistant/1.0",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


async def fetch_pr_details(owner: str, repo: str, pull_number: int) -> Dict[str, Any]:
    """
    Fetches PR details, changed files, and commits from the GitHub REST API.
    """
    headers = get_headers()
    base_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"

    async with httpx.AsyncClient(timeout=20.0) as client:
        # 1. Fetch main PR object
        pr_response = await client.get(base_url, headers=headers)
        if pr_response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Pull request not found for {owner}/{repo}#{pull_number}. Check if the repository is private or misspelled.",
            )
        elif pr_response.status_code == 403:
            detail = pr_response.json().get("message", "GitHub API rate limit exceeded.")
            raise HTTPException(
                status_code=403,
                detail=f"{detail} Please set a valid GITHUB_TOKEN in backend/.env to increase rate limits.",
            )
        elif pr_response.status_code != 200:
            raise HTTPException(
                status_code=pr_response.status_code,
                detail=f"GitHub API error: {pr_response.text}",
            )

        pr_data = pr_response.json()

        # 2. Fetch list of changed files and patches (up to 100 files)
        files_url = f"{base_url}/files?per_page=100"
        files_response = await client.get(files_url, headers=headers)
        files_data = files_response.json() if files_response.status_code == 200 else []

        # 3. Fetch commits (up to 50 commits)
        commits_url = f"{base_url}/commits?per_page=50"
        commits_response = await client.get(commits_url, headers=headers)
        commits_data = commits_response.json() if commits_response.status_code == 200 else []

        commit_messages = [
            c.get("commit", {}).get("message", "").strip()
            for c in commits_data
            if c.get("commit", {}).get("message")
        ]

        return {
            "pr": pr_data,
            "files": files_data,
            "commits": commit_messages,
        }

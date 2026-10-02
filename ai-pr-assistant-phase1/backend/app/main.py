import sys
from pathlib import Path

# Ensure backend root is always in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    PRRequest,
    PRAnalysisResponse,
    RiskItem,
    TestCaseItem,
    ReviewCommentData,
)
from app.services.github_service import parse_github_pr_url, fetch_pr_details
from app.services.diff_service import analyze_affected_modules, prepare_diff_context
from app.services.ai_service import analyze_pr_with_ai


app = FastAPI(
    title="AI Pull Request Assistant API",
    version="2.0.0",
    description="Automated AI Pull Request analysis and code review assistant",
)

# Allow the React development server (Vite) to call this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Basic route to confirm the API is running."""
    return {"message": "AI Pull Request Assistant API is running (Phase 2 Live)"}


@app.get("/health")
def health_check():
    """Health check route used by the frontend to verify backend connectivity."""
    return {"status": "ok", "version": "2.0.0"}


@app.post("/api/analyze-pr", response_model=PRAnalysisResponse)
async def analyze_pr_endpoint(request: PRRequest):
    """
    Main endpoint: Fetches live PR details from GitHub, aggregates diff metrics,
    and generates AI-powered summary, risks, test cases, and review draft.
    """
    raw_url = request.url.strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="PR URL cannot be empty.")

    # 1. Parse GitHub PR URL
    owner, repo, pr_number = parse_github_pr_url(raw_url)

    # 2. Fetch live GitHub metadata, files, and commits
    gh_data = await fetch_pr_details(owner, repo, pr_number)
    pr = gh_data["pr"]
    files = gh_data["files"]
    commits = gh_data["commits"]

    # 3. Analyze affected modules and prepare diff context
    affected_modules = analyze_affected_modules(files)
    diff_text = prepare_diff_context(files)

    title = pr.get("title", f"PR #{pr_number}")
    body = pr.get("body") or ""
    author = pr.get("user", {}).get("login", "unknown")
    status = "MERGED" if pr.get("merged") else pr.get("state", "open").upper()
    lines_added = pr.get("additions", 0)
    lines_removed = pr.get("deletions", 0)
    files_changed = pr.get("changed_files", len(files))

    # 4. Generate AI analysis (Gemini / Groq / Heuristic fallback)
    ai_result = await analyze_pr_with_ai(
        title=title,
        body=body,
        author=author,
        repo_name=f"{owner}/{repo}",
        pr_number=pr_number,
        commits=commits,
        files=files,
        diff_text=diff_text,
        lines_added=lines_added,
        lines_removed=lines_removed,
    )

    # Map risks to RiskItem models
    risk_items = [
        RiskItem(
            category=r.get("category", "General"),
            level=r.get("level", "LOW").upper(),
            badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
            if r.get("level", "").upper() == "HIGH"
            else "text-amber-400 bg-amber-500/10 border-amber-500/30"
            if r.get("level", "").upper() == "MEDIUM"
            else "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            text=r.get("text", ""),
        )
        for r in ai_result.get("risks", [])
    ]

    # Map test cases to TestCaseItem models
    test_case_items = [
        TestCaseItem(
            id=t.get("id", f"TC-{idx+1:02d}"),
            title=t.get("title", f"Test Scenario {idx+1}"),
            scenario=t.get("scenario", ""),
            tag=t.get("tag", "Integration"),
            tagColor="text-[#F9B17A] bg-[#F9B17A]/10 border-[#F9B17A]/30",
            expectedOutcome=t.get("expectedOutcome", ""),
        )
        for idx, t in enumerate(ai_result.get("testCases", []))
    ]

    # Review comment markdown
    review_comment = ReviewCommentData(
        markdown=ai_result.get("reviewCommentMarkdown", f"### PR Review #{pr_number}\n\nLGTM!")
    )

    return PRAnalysisResponse(
        githubUrl=pr.get("html_url", raw_url),
        repoName=f"{owner} / {repo}",
        prNumber=str(pr_number),
        title=title,
        author=author,
        status=status,
        summary=ai_result.get("summary", [f"Pull Request #{pr_number} by @{author} in {owner}/{repo}."]),
        changeType=ai_result.get("changeType", "Enhancement"),
        filesChanged=files_changed,
        linesAdded=lines_added,
        linesRemoved=lines_removed,
        estimatedReviewTime=ai_result.get("estimatedReviewTime", "5 min"),
        affectedModules=affected_modules,
        risks=risk_items,
        testCases=test_case_items,
        reviewComment=review_comment,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

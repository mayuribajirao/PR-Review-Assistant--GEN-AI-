from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class PRRequest(BaseModel):
    url: str


class AffectedModule(BaseModel):
    name: str
    percentage: int
    files_count: int = Field(alias="filesCount")
    color: str = "#F9B17A"

    model_config = ConfigDict(populate_by_name=True)


class RiskItem(BaseModel):
    category: str
    level: str  # "HIGH", "MEDIUM", "LOW"
    badge_color: str = Field(default="text-rose-400 bg-rose-500/10 border-rose-500/30", alias="badgeColor")
    text: str

    model_config = ConfigDict(populate_by_name=True)


class TestCaseItem(BaseModel):
    id: str
    title: str
    scenario: str
    tag: str
    tag_color: str = Field(default="text-[#F9B17A] bg-[#F9B17A]/10 border-[#F9B17A]/30", alias="tagColor")
    expected_outcome: str = Field(alias="expectedOutcome")

    model_config = ConfigDict(populate_by_name=True)


class ReviewCommentData(BaseModel):
    markdown: str


class PRAnalysisResponse(BaseModel):
    github_url: str = Field(alias="githubUrl")
    repo_name: str = Field(alias="repoName")
    pr_number: str = Field(alias="prNumber")
    title: str
    author: str
    status: str
    summary: List[str]
    change_type: str = Field(alias="changeType")
    files_changed: int = Field(alias="filesChanged")
    lines_added: int = Field(alias="linesAdded")
    lines_removed: int = Field(alias="linesRemoved")
    estimated_review_time: str = Field(alias="estimatedReviewTime")
    affected_modules: List[AffectedModule] = Field(alias="affectedModules")
    risks: List[RiskItem]
    test_cases: List[TestCaseItem] = Field(alias="testCases")
    review_comment: ReviewCommentData = Field(alias="reviewComment")

    model_config = ConfigDict(populate_by_name=True)

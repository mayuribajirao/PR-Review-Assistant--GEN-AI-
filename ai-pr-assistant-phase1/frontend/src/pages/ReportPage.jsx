import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { mockPrReport } from "../mockData";
import SummaryCard from "../components/SummaryCard";
import AffectedModulesChart from "../components/AffectedModulesChart";
import RisksCard from "../components/RisksCard";
import TestCasesCard from "../components/TestCasesCard";
import ReviewCommentCard from "../components/ReviewCommentCard";

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract PR url from React Router state or query string
  const queryParams = new URLSearchParams(location.search);
  const passedUrl = location.state?.prUrl || queryParams.get("url") || mockPrReport.githubUrl;

  const [prData, setPrData] = useState(mockPrReport);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsingLiveApi, setIsUsingLiveApi] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrorMessage("");

    fetch("http://127.0.0.1:8000/api/analyze-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: passedUrl }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPrData(data);
          setIsUsingLiveApi(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Backend API unavailable or error, falling back to mock:", err.message);
        if (isMounted) {
          // Derive repo and PR number from URL even in mock mode
          let derivedRepo = mockPrReport.repoName;
          let derivedPrNumber = mockPrReport.prNumber;
          const match = passedUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i);
          if (match) {
            derivedRepo = `${match[1]} / ${match[2]}`;
            derivedPrNumber = match[3];
          }

          setPrData({
            ...mockPrReport,
            githubUrl: passedUrl,
            repoName: derivedRepo,
            prNumber: derivedPrNumber,
          });
          setIsUsingLiveApi(false);
          setIsLoading(false);
          if (!err.message.includes("Failed to fetch")) {
            setErrorMessage(err.message);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [passedUrl]);

  return (
    <div className="bg-brandBg text-bodyText min-h-screen flex flex-col font-sans antialiased selection:bg-accent selection:text-brandBg">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#242841] border-b border-[#424769]/60 sticky top-0 z-50">
        <div className="max-w-[900px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand & Product Name */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-[19px] font-bold text-white tracking-tight flex items-center gap-2.5 hover:opacity-95 transition-opacity"
            >
              <span className="w-8 h-8 rounded-lg bg-[#424769] border border-[#676F9D]/40 flex items-center justify-center text-accent">
                <span className="material-symbols-outlined text-[19px]">
                  terminal
                </span>
              </span>
              <span>ReviewPulse AI</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-5 text-[15px] font-medium text-bodyText">
              <Link to="/report" className="text-white hover:text-accent transition-colors">
                Dashboard
              </Link>
              <a className="text-bodyText hover:text-white transition-colors" href="#docs">
                Docs
              </a>
              <a className="text-bodyText hover:text-white transition-colors" href="#integrations">
                Integrations
              </a>
              <a className="text-bodyText hover:text-white transition-colors" href="#changelog">
                Changelog
              </a>
            </nav>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-accent text-[#2D3250] font-semibold text-[15px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">bolt</span>
              <span>Analyze New PR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single Centered Column Layout */}
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-10 space-y-10">
        {/* API Mode indicator / error notice */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[14px] flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{errorMessage} (Showing preview data)</span>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading ? (
          <div className="bg-cardSurface rounded-[12px] p-12 border border-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
            <div className="space-y-1">
              <h2 className="text-white text-[18px] font-semibold">
                Analyzing Pull Request...
              </h2>
              <p className="text-bodyText text-[14px]">
                Fetching commits, diff patches &amp; running AI code assessment
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Header Card / Block */}
            <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 shadow-md">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-3.5 flex-1">
                  {/* Status Pill & Live Badge */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-[#2D3250] font-semibold text-[14px]">
                      <span className="w-2 h-2 rounded-full bg-[#2D3250]"></span>
                      {prData.status}
                    </span>
                    <span className="text-[15px] font-mono text-bodyText/80">
                      PR #{prData.prNumber}
                    </span>
                    {isUsingLiveApi && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        LIVE AI DATA
                      </span>
                    )}
                  </div>

                  {/* PR Title */}
                  <h1 className="text-[24px] font-semibold text-white leading-snug tracking-tight">
                    {prData.title}
                  </h1>

                  {/* Repo name and PR details */}
                  <p className="text-[16px] text-bodyText leading-relaxed">
                    {prData.repoName} · PR #{prData.prNumber} · opened by{" "}
                    <span className="text-white font-medium">
                      @{prData.author}
                    </span>
                  </p>
                </div>

                {/* External Link Button */}
                <div className="shrink-0 pt-1">
                  <a
                    className="bg-brandBg hover:bg-[#242841] border border-[#676F9D]/50 hover:border-accent text-white text-[15px] font-medium px-4 py-2.5 rounded-[8px] flex items-center gap-2 transition-colors"
                    href={prData.githubUrl || passedUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>View on GitHub</span>
                    <span className="material-symbols-outlined text-[17px]">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
            </section>

            {/* 2. "Summary" Card */}
            <SummaryCard
              summary={prData.summary}
              changeType={prData.changeType}
              filesChanged={prData.filesChanged}
              linesAdded={prData.linesAdded}
              linesRemoved={prData.linesRemoved}
              estimatedReviewTime={prData.estimatedReviewTime}
            />

            {/* 3. "Affected Modules" Card */}
            <AffectedModulesChart affectedModules={prData.affectedModules} />

            {/* 4. "Potential Risks" Card */}
            <RisksCard risks={prData.risks} />

            {/* 5. "Suggested Test Cases" Card */}
            <TestCasesCard testCases={prData.testCases} />

            {/* 6. "Review Comment" Card */}
            <ReviewCommentCard reviewComment={prData.reviewComment} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#242841] border-t border-[#424769]/60 mt-16 py-8">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-bodyText">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-[16px]">
              ReviewPulse AI
            </span>
            <span className="text-[#676F9D]">|</span>
            <span>Automated PR Intelligence with Gemini &amp; GitHub</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="hover:text-accent transition-colors" href="#documentation">
              Documentation
            </a>
            <a className="hover:text-accent transition-colors" href="#extension">
              GitHub Extension
            </a>
            <a className="hover:text-accent transition-colors" href="#status">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackendStatusBadge from "../components/BackendStatusBadge";

export default function LandingPage() {
  const [prUrl, setPrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFillExample = (url) => {
    setPrUrl(url);
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = prUrl.trim();

    if (!trimmed) {
      setErrorMessage("Please enter a GitHub Pull Request URL");
      return;
    }

    // Basic GitHub PR URL validation
    const githubPrRegex = /github\.com\/[^/]+\/[^/]+\/pull\/\d+/i;
    if (!githubPrRegex.test(trimmed)) {
      setErrorMessage("Please enter a valid GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    // Provide a smooth feedback transition before navigating
    setTimeout(() => {
      navigate(`/report?url=${encodeURIComponent(trimmed)}`, {
        state: { prUrl: trimmed },
      });
    }, 600);
  };

  return (
    <div className="bg-[#2D3250] text-[#D8DAE8] font-sans min-h-screen flex flex-col justify-between antialiased selection:bg-[#F9B17A] selection:text-[#2D3250]">
      {/* Minimal Header Navigation */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
          {/* Brand Logo / Product Anchor */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-[8px] bg-[#424769] flex items-center justify-center text-[#F9B17A]">
              <span className="material-symbols-outlined text-[19px]">terminal</span>
            </div>
            <span className="text-[17px] tracking-tight font-semibold">
              ReviewPulse AI
            </span>
            <span className="hidden sm:inline-block text-[#676F9D] text-[13px] font-normal ml-1">
              / AI Pull Request Assistant
            </span>
          </Link>

          {/* Minimal Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8 text-[14px]">
            <a className="text-[#D8DAE8] hover:text-white transition-colors" href="#docs">
              Docs
            </a>
            <a className="text-[#D8DAE8] hover:text-white transition-colors" href="#integrations">
              Integrations
            </a>
            <a className="text-[#676F9D] hover:text-white transition-colors" href="#signin">
              Sign In
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content: Centered, calm, uncluttered & spacious */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-12 sm:py-20 w-full max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="text-white text-[32px] sm:text-[36px] font-semibold tracking-tight text-center leading-[1.25] mb-4">
          Understand any Pull Request in seconds.
        </h1>

        {/* Subtext: Relaxed single sentence in #D8DAE8, 16-18px */}
        <p className="text-[#D8DAE8] text-[16px] sm:text-[18px] text-center max-w-2xl leading-relaxed font-normal">
          Drop in a GitHub link to get clear architectural summaries, risk alerts, and human review drafts in moments.
        </p>

        {/* 48px spacing below subtext before the input */}
        <div className="w-full max-w-[620px] mt-[48px]">
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Input Container / Card: #424769, 12px rounded, min 56px height */}
            <div
              className={`w-full min-h-[58px] bg-[#424769] rounded-[12px] p-2 flex items-center gap-2.5 shadow-lg transition-all ${
                errorMessage
                  ? "ring-2 ring-rose-400"
                  : "focus-within:ring-2 focus-within:ring-[#F9B17A]/40"
              }`}
            >
              {/* GitHub Icon Inside Left */}
              <div className="pl-3.5 flex items-center text-[#D8DAE8]/70 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </div>

              {/* Input Element */}
              <input
                id="pr-url-input"
                type="text"
                value={prUrl}
                onChange={(e) => {
                  setPrUrl(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Paste a GitHub PR URL…"
                spellCheck="false"
                autoComplete="off"
                className="flex-1 bg-transparent border-none text-white text-[16px] placeholder:text-[#D8DAE8]/50 focus:ring-0 focus:outline-none px-1 py-1"
              />

              {/* Primary Button: Solid #F9B17A, navy text, 12px rounded, generously padded */}
              <button
                id="analyze-btn"
                type="submit"
                disabled={isLoading}
                className="h-[44px] px-6 bg-[#F9B17A] hover:bg-[#fabc8c] active:scale-[0.98] text-[#2D3250] font-semibold text-[15px] rounded-[12px] transition-all flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer disabled:opacity-70"
              >
                <span>{isLoading ? "Analyzing..." : "Analyze PR"}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {isLoading ? "progress_activity" : "arrow_forward"}
                </span>
              </button>
            </div>
          </form>

          {/* Validation error if any */}
          {errorMessage && (
            <p className="mt-2 px-3 text-[13px] text-rose-400 font-medium">
              {errorMessage}
            </p>
          )}

          {/* Optional subtle example helper */}
          <div className="mt-3.5 px-3 flex items-center justify-between text-[#676F9D] text-[13px]">
            <span>
              Try an example:
              <button
                type="button"
                onClick={() =>
                  handleFillExample(
                    "https://github.com/supabase/auth-js/pull/842"
                  )
                }
                className="text-[#D8DAE8]/80 hover:text-[#F9B17A] ml-1 font-mono transition-colors underline underline-offset-2 cursor-pointer"
              >
                supabase/auth-js#842
              </button>
            </span>
            <span className="hidden sm:inline-block font-mono text-[12px]">
              Cmd + Enter
            </span>
          </div>

          {/* Feedback status notification */}
          {isLoading && (
            <div className="mt-4 px-4 py-2.5 rounded-[12px] bg-[#424769] text-[#F9B17A] text-[14px] flex items-center gap-2.5 justify-center animate-fade-in">
              <span className="material-symbols-outlined text-[18px] animate-spin">
                progress_activity
              </span>
              <span>Fetching PR metadata &amp; analyzing diff...</span>
            </div>
          )}
        </div>

        {/* Below input: Exactly three feature highlights in a simple horizontal row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-10 sm:gap-14 text-[#676F9D]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#676F9D]">
              description
            </span>
            <span className="text-[15px] font-medium text-[#676F9D]">
              Summary
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#676F9D]">
              shield_with_heart
            </span>
            <span className="text-[15px] font-medium text-[#676F9D]">
              Risk Detection
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#676F9D]">
              fact_check
            </span>
            <span className="text-[15px] font-medium text-[#676F9D]">
              Test Suggestions
            </span>
          </div>
        </div>
      </main>

      {/* Minimal Footer: Very bottom only in muted tone */}
      <footer className="w-full pb-8 pt-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[#676F9D] text-[13px] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© 2025 ReviewPulse AI. Fast, thoughtful code reviews.</span>
            <BackendStatusBadge />
          </div>
          <div className="flex items-center gap-6">
            <a className="hover:text-[#D8DAE8] transition-colors" href="#privacy">
              Privacy
            </a>
            <a className="hover:text-[#D8DAE8] transition-colors" href="#terms">
              Terms
            </a>
            <a className="hover:text-[#D8DAE8] transition-colors" href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

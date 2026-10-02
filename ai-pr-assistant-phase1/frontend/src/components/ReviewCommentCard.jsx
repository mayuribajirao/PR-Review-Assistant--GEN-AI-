import { useState } from "react";

function formatInlineCode(text, isCardSurface = true) {
  if (!text) return "";
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`font-mono text-accent ${
            isCardSurface ? "bg-cardSurface" : "bg-brandBg"
          } px-1.5 py-0.5 rounded border border-[#676F9D]/40`}
        >
          {code}
        </code>
      );
    }
    return part;
  });
}

export default function ReviewCommentCard({ reviewComment = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Strip backticks for clean clipboard copy if needed or copy full text
      const cleanText = reviewComment.replace(/`/g, "");
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy review comment:", err);
    }
  };

  return (
    <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 border-l-4 border-l-accent shadow-md">
      {/* Comment Card Header with Avatar / Reviewer and Copy Button */}
      <div className="flex items-center justify-between pb-5 border-b border-mutedAccent/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brandBg border border-[#676F9D]/40 flex items-center justify-center text-accent">
            <span className="material-symbols-outlined text-[20px]">
              smart_toy
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-white">
                ai-reviewer
              </span>
              <span className="text-[14px] text-bodyText/80">
                generated draft
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="bg-brandBg hover:bg-[#242841] border border-[#676F9D]/50 hover:border-accent text-white text-[15px] font-medium px-4 py-2 rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? "check" : "content_copy"}
          </span>
          <span>{copied ? "Copied!" : "Copy comment"}</span>
        </button>
      </div>

      {/* Comment Body Styled like GitHub PR Comment */}
      <div className="mt-6 p-6 rounded-[8px] bg-brandBg border border-[#676F9D]/30">
        <p className="text-[16px] text-bodyText leading-[1.6]">
          {formatInlineCode(reviewComment, true)}
        </p>
      </div>

      {/* Actions beneath comment */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-[14px] text-bodyText/80 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-accent text-[17px]">
            verified
          </span>
          Verified with AST diff parser
        </span>
        <div className="flex items-center gap-3">
          <button
            className="text-bodyText hover:text-white text-[15px] font-medium px-3 py-2 transition-colors cursor-pointer"
            type="button"
          >
            Regenerate
          </button>
          <button
            className="bg-accent text-[#2D3250] font-semibold text-[15px] px-4 py-2 rounded-[8px] flex items-center gap-2 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">send</span>
            <span>Post to GitHub</span>
          </button>
        </div>
      </div>
    </section>
  );
}

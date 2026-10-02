export default function SummaryCard({
  summary,
  changeType = "Feature",
  filesChanged = 8,
  linesAdded = 142,
  linesRemoved = 37,
  estimatedReviewTime = "~8 min",
}) {
  return (
    <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 shadow-md">
      <h2 className="text-[20px] font-semibold text-white tracking-tight mb-4 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-accent text-[22px]">
          subject
        </span>
        Summary
      </h2>

      {/* Full untruncated paragraph */}
      <p className="text-[16px] text-bodyText leading-[1.6]">{summary}</p>

      {/* Stat labels as clean plain text with small colored dots */}
      <div className="mt-8 pt-6 border-t border-mutedAccent/30 flex flex-wrap items-center gap-x-7 gap-y-3 text-[16px] text-bodyText">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
          <span>
            Change type:{" "}
            <strong className="text-white font-medium">{changeType}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#676F9D]"></span>
          <span>
            Files changed:{" "}
            <strong className="text-white font-medium">{filesChanged}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#676F9D]"></span>
          <span>
            Lines:{" "}
            <strong className="text-white font-mono font-medium">
              +{linesAdded}
            </strong>{" "}
            / <span className="text-white font-mono">-{linesRemoved}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
          <span>
            Est. review time:{" "}
            <strong className="text-white font-medium">
              {estimatedReviewTime}
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
}

function formatInlineCode(text) {
  if (!text) return "";
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-accent bg-brandBg px-1.5 py-0.5 rounded border border-[#676F9D]/40"
        >
          {code}
        </code>
      );
    }
    return part;
  });
}

export default function TestCasesCard({ testCases = [] }) {
  return (
    <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="material-symbols-outlined text-accent text-[22px]">
            checklist
          </span>
          Suggested Test Cases
        </h2>
        <span className="text-[15px] text-bodyText/80">
          {testCases.length} verification items
        </span>
      </div>

      {/* Simple checklist with generous vertical spacing */}
      <div className="space-y-4">
        {testCases.map((item, idx) => (
          <label
            key={idx}
            className="flex items-start gap-4 p-4 rounded-[8px] bg-brandBg/60 hover:bg-brandBg border border-[#676F9D]/30 hover:border-accent/50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 rounded border-[#676F9D] bg-[#2D3250] text-accent focus:ring-accent focus:ring-offset-0 transition cursor-pointer"
            />
            <span className="text-[16px] text-bodyText group-hover:text-white transition-colors leading-[1.6]">
              {formatInlineCode(item.text || item)}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

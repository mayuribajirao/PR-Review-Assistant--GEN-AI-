export default function RisksCard({ risks = [] }) {
  return (
    <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="material-symbols-outlined text-accent text-[22px]">
            warning
          </span>
          Potential Risks &amp; Considerations
        </h2>
        <span className="text-[14px] font-medium text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/30">
          {risks.length} identified
        </span>
      </div>

      {/* Vertical List with 16px+ spacing */}
      <div className="space-y-5">
        {risks.map((risk, idx) => (
          <div key={idx} className="flex items-start gap-3.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-2"></span>
            <p className="text-[16px] text-bodyText leading-[1.6]">
              {risk.title ? (
                <>
                  <strong className="text-white font-medium">
                    {risk.title}:
                  </strong>{" "}
                  {risk.text}
                </>
              ) : (
                risk.text || risk
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AffectedModulesChart({ affectedModules = [] }) {
  const moduleCount = affectedModules.length;

  return (
    <section className="bg-cardSurface rounded-[12px] p-8 border border-white/5 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold text-white tracking-tight flex items-center gap-2.5">
          <span className="material-symbols-outlined text-accent text-[22px]">
            account_tree
          </span>
          Affected Modules
        </h2>
        <span className="text-[15px] font-mono text-bodyText/80">
          {moduleCount} {moduleCount === 1 ? "module" : "modules"}
        </span>
      </div>

      {/* Horizontal Bar Chart Rows */}
      <div className="space-y-4">
        {affectedModules.map((item, index) => (
          <div key={index} className="min-h-[44px] flex flex-col justify-center">
            <div className="flex justify-between items-center text-[16px] mb-2">
              <span className="font-mono text-bodyText truncate pr-4">
                {item.name}
              </span>
              <span className="font-medium text-white shrink-0 font-mono">
                {item.percentage}%
              </span>
            </div>
            <div className="w-full bg-brandBg rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-accent h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

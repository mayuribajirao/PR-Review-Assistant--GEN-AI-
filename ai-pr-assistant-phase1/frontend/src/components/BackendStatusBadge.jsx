import { useEffect, useState } from "react";

export default function BackendStatusBadge() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((res) => {
        if (!res.ok) throw new Error("Backend error");
        return res.json();
      })
      .then((data) => {
        setStatus(data.status === "ok" ? "connected" : "ready");
      })
      .catch(() => {
        setStatus("unavailable");
      });
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
      case "ready":
        return "bg-emerald-400";
      case "checking":
        return "bg-amber-400 animate-pulse";
      default:
        return "bg-rose-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
      case "ready":
        return "Backend API: Online";
      case "checking":
        return "Backend: Checking...";
      default:
        return "Backend API: Offline (Mock Mode Active)";
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#424769]/50 border border-[#676F9D]/30 text-[12px] font-mono text-[#D8DAE8]/90">
      <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
      <span>{getStatusText()}</span>
    </div>
  );
}

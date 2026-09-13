"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f4f6f8", color: "#17212b" }}>
      <section style={{ width: "min(560px, 100%)", padding: 28, border: "1px solid #dce2e8", borderRadius: 10, background: "white", textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>演示数据加载失败</h1>
        <p>请刷新页面或重置模拟。</p>
        <button type="button" onClick={reset} style={{ border: 0, borderRadius: 7, padding: "11px 18px", background: "#155eef", color: "white", cursor: "pointer" }}>
          重置模拟
        </button>
      </section>
    </main>
  );
}


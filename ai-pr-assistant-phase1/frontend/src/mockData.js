export const mockPrReport = {
  title: "feat(router): Add optimistic navigation caching & prefetch deduplication",
  repoName: "vercel / next.js",
  prNumber: "64812",
  author: "timneutkens",
  status: "Open",
  githubUrl: "https://github.com/vercel/next.js/pull/64812",
  summary:
    "This PR introduces an in-memory client-side cache for prefetch requests during client navigations. By deduplicating concurrent prefetch requests for the same route and caching page payloads for 30 seconds, it significantly reduces redundant server hits during fast tab switches without altering data mutation invalidation behavior. Overall response latency on subsequent sub-page transitions drops considerably for high-traffic Next.js deployments.",
  changeType: "Feature",
  filesChanged: 8,
  linesAdded: 142,
  linesRemoved: 37,
  estimatedReviewTime: "~8 min",
  affectedModules: [
    { name: "packages/next/src/client/router.ts", percentage: 42 },
    { name: "packages/next/src/shared/lib/router-context.ts", percentage: 28 },
    { name: "packages/next/src/server/render.tsx", percentage: 16 },
    { name: "test/e2e/app-dir/navigation/test.ts", percentage: 10 },
    { name: "docs/routing/prefetching.md", percentage: 4 },
  ],
  risks: [
    {
      title: "Cache invalidation on route transitions",
      text: "Verify if rapid backward/forward browser history navigations properly flush stale route payloads.",
    },
    {
      title: "Memory leak edge cases",
      text: "Long-lived single page apps might retain stale route descriptors if client navigations exceed typical session thresholds.",
    },
    {
      title: "Missing unit test for race conditions",
      text: "Prefetch deduplication queue lacks explicit concurrency stress tests in the current test suite.",
    },
  ],
  testCases: [
    {
      text: "Trigger 5 rapid consecutive navigations between two heavy server-component routes and assert only 1 network request is dispatched.",
    },
    {
      text: "Verify that `router.refresh()` forcibly invalidates both local prefetch cache and server component payload.",
    },
    {
      text: "Confirm backward compatibility in legacy `pages/` directory when mixed routing mode is active.",
    },
    {
      text: "Test behavior under throttled 3G network conditions when prefetch aborts mid-flight.",
    },
  ],
  reviewComment:
    "Thanks for tackling this! The prefetch deduplication logic in `router.ts` looks clean and should noticeably reduce edge function invocations. Before approving, could we add a targeted test case asserting that `router.refresh()` properly purges cached route payloads during fast navigations? Also, double-check how memory cleanup behaves on unmounted tab instances. Overall, great performance win!",
};

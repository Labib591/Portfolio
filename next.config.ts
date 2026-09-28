import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 writes an AGENTS.md + a CLAUDE.md that just says "@AGENTS.md".
  // Unasked-for repo noise here; flip to true to get them back.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Art is served from Neon's branchable object storage, not the repo.
    remotePatterns: [
      { protocol: "https", hostname: "*.storage.c-10.us-east-1.aws.neon.tech" },
      { protocol: "https", hostname: "*.storage.*.aws.neon.tech" },
    ],
  },
  experimental: {
    // Server Actions default to a 1MB body, and uploads go through one. A
    // 1.7MB film poster was rejected before any of our code ran, so the
    // request died as a bare "Failed to fetch" and storage.ts's friendly
    // "limit is 12MB" message was never reachable. This MUST stay >= MAX_BYTES
    // in src/lib/storage.ts or that mismatch comes straight back.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;

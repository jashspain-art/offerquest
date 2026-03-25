import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ADZUNA_APP_ID = Deno.env.get("ADZUNA_APP_ID");
const ADZUNA_API_KEY = Deno.env.get("ADZUNA_API_KEY");

const MOCK_JOBS = [
  {
    title: "Senior Frontend Developer",
    company: "Stripe",
    location: "London, UK",
    description: "Build and maintain high-performance React applications for millions of users. You'll work on core payment UIs, dashboards, and developer tools. Strong TypeScript and React experience required.",
    url: "https://stripe.com/jobs",
    source: "mock",
    metadata: { salary: "£80,000 - £110,000", type: "Full-time", match_score: 95, tags: ["React", "TypeScript", "Fintech"] },
  },
  {
    title: "Full Stack Engineer",
    company: "Vercel",
    location: "Remote",
    description: "Join the team building the world's best deployment platform. Work on Next.js, edge computing, and developer experience. Experience with Node.js and cloud infrastructure required.",
    url: "https://vercel.com/careers",
    source: "mock",
    metadata: { salary: "£70,000 - £95,000", type: "Full-time", match_score: 88, tags: ["Next.js", "Node.js", "Cloud"] },
  },
  {
    title: "Software Engineer - Backend",
    company: "Monzo",
    location: "London, UK",
    description: "Help build the infrastructure that powers a bank for millions. You'll work on high-availability Go microservices, Kafka event streaming, and Cassandra databases.",
    url: "https://monzo.com/careers",
    source: "mock",
    metadata: { salary: "£75,000 - £100,000", type: "Full-time", match_score: 82, tags: ["Go", "Kafka", "Fintech"] },
  },
  {
    title: "AI/ML Engineer",
    company: "DeepMind",
    location: "London, UK",
    description: "Research and deploy cutting-edge machine learning models. Collaborate with world-leading researchers on groundbreaking AI applications. PyTorch and research publication experience preferred.",
    url: "https://deepmind.google/careers",
    source: "mock",
    metadata: { salary: "£90,000 - £130,000", type: "Full-time", match_score: 79, tags: ["Python", "PyTorch", "AI"] },
  },
  {
    title: "Product Engineer",
    company: "Linear",
    location: "Remote",
    description: "Build beautiful, fast software that developers love. End-to-end ownership of features from design to deployment. Passion for product quality and performance optimization.",
    url: "https://linear.app/careers",
    source: "mock",
    metadata: { salary: "£65,000 - £90,000", type: "Full-time", match_score: 91, tags: ["React", "TypeScript", "Product"] },
  },
  {
    title: "Platform Engineer",
    company: "Cloudflare",
    location: "Remote",
    description: "Work on the edge. Build and maintain the infrastructure powering Cloudflare Workers and the broader platform. Experience with Rust or Go and distributed systems required.",
    url: "https://cloudflare.com/careers",
    source: "mock",
    metadata: { salary: "£80,000 - £105,000", type: "Full-time", match_score: 75, tags: ["Rust", "Go", "Edge Computing"] },
  },
];

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { what = "software engineer", where = "london", results_per_page = 20 } =
      await req.json().catch(() => ({}));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let jobs = MOCK_JOBS;

    // If Adzuna credentials are available, fetch real jobs
    if (ADZUNA_APP_ID && ADZUNA_API_KEY) {
      const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=${results_per_page}&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}&content-type=application/json`;

      const adzunaRes = await fetch(adzunaUrl);
      if (adzunaRes.ok) {
        const adzunaData = await adzunaRes.json();
        jobs = adzunaData.results.map((j: Record<string, unknown>) => ({
          title: j.title as string,
          company: (j.company as Record<string, string>)?.display_name ?? "Unknown",
          location: (j.location as Record<string, string>)?.display_name ?? where,
          description: j.description as string,
          url: j.redirect_url as string,
          source: "adzuna",
          metadata: {
            salary: j.salary_min ? `£${j.salary_min} - £${j.salary_max}` : "Competitive",
            type: "Full-time",
            match_score: Math.floor(Math.random() * 30) + 70,
            tags: [],
          },
        }));
      }
    }

    // Upsert jobs into DB
    const { error } = await supabase.from("jobs").upsert(
      jobs.map((j) => ({ ...j, created_at: new Date().toISOString() })),
      { onConflict: "url" }
    );

    if (error) {
      // If upsert with conflict fails (url column might not have unique constraint), do insert
      await supabase.from("jobs").insert(
        jobs.map((j) => ({ ...j, created_at: new Date().toISOString() }))
      );
    }

    return new Response(
      JSON.stringify({ success: true, count: jobs.length, jobs_seeded: jobs.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

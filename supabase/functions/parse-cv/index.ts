import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const MOCK_PARSED_DATA = {
  name: "Alex Johnson",
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
  experience: [
    {
      role: "Senior Frontend Developer",
      company: "TechCorp Ltd",
      duration: "2021 - Present",
      description: "Led the rebuild of the main product dashboard using React and TypeScript.",
    },
    {
      role: "Full Stack Developer",
      company: "StartupXYZ",
      duration: "2019 - 2021",
      description: "Built and maintained REST APIs and React frontends.",
    },
  ],
  education: [
    {
      degree: "BSc Computer Science",
      institution: "University of Manchester",
      year: "2019",
    },
  ],
  summary:
    "Experienced full-stack developer with 5+ years building scalable web applications.",
};

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cv_id } = await req.json();

    if (!cv_id) {
      return new Response(JSON.stringify({ error: "cv_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the CV record
    const { data: cv, error: cvError } = await supabase
      .from("cvs")
      .select("*")
      .eq("id", cv_id)
      .single();

    if (cvError || !cv) {
      return new Response(JSON.stringify({ error: "CV not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsedData = MOCK_PARSED_DATA;

    // If OpenAI key is available, use real parsing
    if (OPENAI_API_KEY && cv.file_url) {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a CV parser. Extract structured data from the CV and return a JSON object with keys: name, skills (array), experience (array of {role, company, duration, description}), education (array of {degree, institution, year}), summary.",
            },
            {
              role: "user",
              content: `Parse this CV URL: ${cv.file_url}. Return only valid JSON.`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (openaiResponse.ok) {
        const aiData = await openaiResponse.json();
        parsedData = JSON.parse(aiData.choices[0].message.content);
      }
    }

    // Update the CV record with parsed data
    const { error: updateError } = await supabase
      .from("cvs")
      .update({ parsed_data: parsedData })
      .eq("id", cv_id);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true, data: parsedData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

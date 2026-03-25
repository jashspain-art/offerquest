import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const MOCK_COVER_LETTER = (jobTitle: string, company: string, userName: string) => `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. As an experienced software engineer with a proven track record of building scalable, user-centric applications, I believe I am an excellent fit for this role.

Throughout my career, I have developed a deep expertise in modern web technologies including React, TypeScript, and Node.js. My experience spans from architecting complex frontend systems to building robust backend APIs, giving me a holistic understanding of the full product lifecycle.

What excites me most about ${company} is your commitment to engineering excellence and the impact your product has on millions of users. I am confident that my skills and passion for building great software would make me a valuable addition to your team.

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.

Best regards,
${userName}`;

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { job_title, company, job_description, user_name, user_summary, user_skills } =
      await req.json();

    if (!job_title || !company) {
      return new Response(
        JSON.stringify({ error: "job_title and company are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let coverLetter = MOCK_COVER_LETTER(job_title, company, user_name || "Alex Johnson");

    if (OPENAI_API_KEY) {
      const prompt = `Write a professional, compelling, and personalized cover letter for the following:

Job Title: ${job_title}
Company: ${company}
Job Description: ${job_description || "Not provided"}

Candidate Profile:
- Name: ${user_name || "the candidate"}
- Summary: ${user_summary || "Experienced software engineer"}
- Key Skills: ${(user_skills || []).join(", ")}

Write in first person, be specific about the company, keep it under 350 words. Return only the letter text, no subject line.`;

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an expert career coach and professional writer specializing in job applications." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (openaiResponse.ok) {
        const aiData = await openaiResponse.json();
        coverLetter = aiData.choices[0].message.content;
      }
    }

    return new Response(
      JSON.stringify({ success: true, cover_letter: coverLetter }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

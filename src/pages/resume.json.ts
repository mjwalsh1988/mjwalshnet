// The resume in the JSON Resume schema, from the same source as the page.
import type { APIRoute } from "astro";
import { resume } from "../data/resume";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(resume, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

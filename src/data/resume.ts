// The one source for the resume page, the PDF and /resume.json, in the JSON
// Resume schema (https://jsonresume.org/schema). Titles, employers and dates
// are the confirmed facts from section 7.5 of the plan. Every description is
// Michael's to write from the resume interview; the LinkedIn text is not
// reused.

export type ResumeWork = {
  name: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
  url?: string;
};

export const resume = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: "Michael Walsh",
    label: "Full-Stack Developer and Automation / AI Specialist",
    image: "https://mjwalsh.net/img/michael-walsh.jpg",
    email: "[MICHAEL: the email address you want on the resume]",
    url: "https://mjwalsh.net",
    summary:
      "[MICHAEL: three or four sentences in your own words: twenty years in software counting freelance work since you were 14, two Director of Technology roles, a hosting company you founded and sold, and what you do now at JWeis. Say plainly that you are open to Director of Technology and full-stack roles.]",
    location: { city: "Fort Wayne", region: "Indiana", countryCode: "US" },
    profiles: [
      {
        network: "LinkedIn",
        username: "michaeljameswalsh",
        url: "https://www.linkedin.com/in/michaeljameswalsh",
      },
      { network: "GitHub", username: "mjwalsh1988", url: "https://github.com/mjwalsh1988" },
    ],
  },
  openTo: ["Director of Technology", "Full-stack developer"],
  work: [
    {
      name: "JWeis Marketing",
      position: "Full-Stack Developer and Automation / AI Specialist",
      location: "Remote",
      startDate: "2024-10",
      summary: "[MICHAEL: what you actually do at JWeis now, in your words]",
      highlights: [
        "[MICHAEL: one concrete thing you built or run at JWeis, with a real number if you have one]",
      ],
      url: "https://jweis.com",
    },
    {
      name: "Career break",
      position: "Recovery and relearning how to live blind",
      startDate: "2022-10",
      endDate: "2024-10",
      summary:
        "[MICHAEL: your words. The facts on record: vision problems through 2022, a brain tumor found in October 2022, a craniotomy, sight lost as a complication of the tumor and the surgery, two years spent recovering and relearning how to live blind.]",
      highlights: [],
    },
    {
      name: "BigScoots",
      position: "Support Engineer",
      location: "Remote",
      startDate: "2022-01",
      endDate: "2023-04",
      summary: "[MICHAEL: what you did at BigScoots]",
      highlights: [],
    },
    {
      name: "Hoststing LLC",
      position: "Chief Executive Officer and founder",
      location: "Houston, Texas",
      startDate: "2015-02",
      endDate: "2022-04",
      summary:
        "[MICHAEL: the Hoststing story in a few sentences: a Linux web hosting company you founded and ran for seven years with a global team of developers and support engineers, sold in a private sale to GlowHost together with its sister company cutalltheshit.com under the same LLC]",
      highlights: ["[MICHAEL: a real number or two: customers, servers, uptime, team size]"],
    },
    {
      name: "JWeis Marketing",
      position: "Director of Technology",
      location: "Sugar Land, Texas",
      startDate: "2020-08",
      endDate: "2022-01",
      summary: "[MICHAEL: what you ran and built as Director of Technology at JWeis]",
      highlights: [],
      url: "https://jweis.com",
    },
    {
      name: "Marie Forleo International",
      position: "Full Stack Developer",
      location: "Remote",
      startDate: "2019-08",
      endDate: "2020-03",
      summary:
        "[MICHAEL: your words. On record: headless WordPress with Vue and Nuxt, and a proprietary learning management system.]",
      highlights: [],
    },
    {
      name: "Supplement Technologies",
      position: "Director of Technology",
      location: "Houston, Texas",
      startDate: "2015-08",
      endDate: "2019-08",
      summary:
        "[MICHAEL: your words. On record: SEO across a network of sites, distributed server infrastructure, high-traffic ecommerce platforms, internal IT.]",
      highlights: [],
    },
    {
      name: "Kualo",
      position: "Systems Engineer and Developer",
      location: "Remote",
      startDate: "2014-05",
      endDate: "2015-08",
      summary: "[MICHAEL: what you did at Kualo]",
      highlights: [],
    },
    {
      name: "A Small Orange",
      position: "Technical Support",
      location: "Remote",
      startDate: "2013-12",
      endDate: "2014-04",
      summary: "[MICHAEL: what you did at A Small Orange]",
      highlights: [],
    },
    {
      name: "Arvixe.com",
      position: "Systems Developer",
      location: "Remote",
      startDate: "2013-01",
      endDate: "2013-11",
      summary:
        "[MICHAEL: your words. On record: internal billing, HR and server automation systems.]",
      highlights: [],
    },
    {
      name: "OEGLLC",
      position: "Lead Developer",
      location: "Houston, Texas",
      startDate: "2012-10",
      endDate: "2013-02",
      summary:
        "[MICHAEL: your words. On record: primary designer and full-stack developer for client projects.]",
      highlights: [],
    },
    {
      name: "Hostgator.com",
      position: "Systems Developer",
      location: "Houston, Texas",
      startDate: "2011-02",
      endDate: "2012-10",
      summary:
        "[MICHAEL: your words. On record: internal employee management, billing and support platforms.]",
      highlights: [],
    },
    {
      name: "Hostgator.com",
      position: "Level 3 Technical Support",
      location: "Houston, Texas",
      startDate: "2009-08",
      endDate: "2011-02",
      summary: "[MICHAEL: what Level 3 support meant at Hostgator]",
      highlights: [],
    },
    {
      name: "Freelance development",
      position: "Developer",
      startDate: "[MICHAEL: the year you turned 14]",
      endDate: "2009-08",
      summary:
        "[MICHAEL: the freelance years from age 14 until Hostgator, and alongside it: what kind of work, for whom, in your words]",
      highlights: [],
    },
  ] satisfies ResumeWork[],
  education: [
    {
      institution: "Woodstock High School",
      studyType: "High school diploma",
      startDate: "2003",
      endDate: "2007",
    },
  ],
  skills: [
    {
      name: "[MICHAEL: skill group, for example Full-stack development]",
      keywords: ["[MICHAEL: the tools and languages you would put under it]"],
    },
    {
      name: "[MICHAEL: skill group, for example Hosting and Linux]",
      keywords: ["[MICHAEL: keywords]"],
    },
    {
      name: "[MICHAEL: skill group, for example Automation and AI]",
      keywords: ["[MICHAEL: keywords]"],
    },
    {
      name: "[MICHAEL: skill group, for example SEO and marketing technology]",
      keywords: ["[MICHAEL: keywords]"],
    },
  ],
  projects: [
    {
      name: "FF Beacon",
      url: "https://ffbeacon.com",
      description: "[MICHAEL: one line on FF Beacon for the resume]",
      roles: ["Founder"],
    },
    {
      name: "Gridiron Sites",
      url: "https://gridironsites.com",
      description: "[MICHAEL: one line on Gridiron Sites for the resume]",
      roles: ["Founder"],
    },
  ],
  meta: {
    canonical: "https://mjwalsh.net/resume.json",
    version: "v1.0.0",
    lastModified: "2026-10-21",
  },
};

export type Resume = typeof resume;

/** "2024-10" to "October 2024"; a bare year stays a year; a placeholder stays as written. */
export function formatResumeDate(value: string | undefined): string {
  if (!value) return "present";
  if (value.startsWith("[MICHAEL")) return value;
  const [year, month] = value.split("-");
  if (!month) return year ?? value;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

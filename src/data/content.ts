export const content = {
  hero: {
    firstName: "TANMAY",
    fullName: "Tanmay Garg",
    subtitle: "SOFTWARE ENGINEER / CLOUD BUILDER",
    bio: "I am a Computer Science Engineering student passionate about architecting scalable backend systems and robust cloud solutions. With a strong foundation in AWS, serverless architecture, and full-stack development, I build high-performance applications that handle real-time data seamlessly.",
    resumePath: "/resume.pdf"
  },
  widgets: {
    status: {
      label: "STATUS",
      text: "Available for new opportunities"
    },
    quotes: [
      {
        text: "THE DETAILS ARE NOT THE DETAILS. THEY MAKE THE DESIGN.",
        author: "CHARLES EAMES"
      },
      {
        text: "FIRST, SOLVE THE PROBLEM. THEN, WRITE THE CODE.",
        author: "JOHN JOHNSON"
      },
      {
        text: "TALK IS CHEAP. SHOW ME THE CODE.",
        author: "LINUS TORVALDS"
      },
      {
        text: "SIMPLICITY IS THE SOUL OF EFFICIENCY.",
        author: "AUSTIN FREEMAN"
      }
    ],
    leadership: [
      { 
        role: "Competitive Dept Leader", 
        club: "CodeChef Club", 
        year: "2026", 
        description: "Directed the competitive programming division, leading a team of core members to foster a strong coding culture. Successfully conceptualized, planned, and organized the 'Clash of Coders' college CP contest, drawing high participation and elevating the college's competitive programming standards." 
      },
      { 
        role: "Member (Competitive Dept)", 
        club: "CodeChef Club", 
        year: "2025", 
        description: "Actively contributed to the competitive programming department by organizing weekly peer-learning sessions, curating problem sets, and mentoring junior students. Played a pivotal role in the execution and logistics of the inaugural 'Clash of Coders' event." 
      }
    ],
    certifications: {
      top: {
        title: "AWS Certified Solution Architect",
        issuer: "Amazon Web Services",
        date: "Scheduled in 2026"
      }
    },
    lastPlayed: {
      track: "Starboy",
      artist: "The Weeknd",
      albumArt: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452"
    }
  },
  experience: [
    {
      company: "IBM",
      role: "Project-Based Internship",
      current: false,
      mode: "Remote",
      date: "'26 — '26",
      location: "India",
      description: "Architected a highly secure cloud file storage system utilizing AWS S3 and IAM, ingeniously storing user and file metadata as JSON to entirely eliminate the need for a separate database. Implemented robust JWT-based authentication with password hashing, and designed strict least-privilege IAM policies to minimize security risks. Streamlined the CI/CD pipeline using GitHub Actions for automated deployment checks, and integrated comprehensive file management features via the AWS SDK while adopting Agile SDLC best practices.",
      tags: ["KUBERNETES", "DOCKER", "AWS S3", "IAM", "JWT", "GITHUB ACTIONS"],
      github: "https://github.com/tanmaygarg06/SecureDoc"
    }
  ],
  projects: [
    {
      title: "Vibe-Check Dashboard",
      year: "2026",
      description: "Engineered a highly scalable sentiment analysis API classifying text into 8 distinct emotions with ~500ms latency. Leveraged AWS Lambda and API Gateway for a serverless architecture handling 1,000+ requests/min at near-zero costs. Integrated Amazon Bedrock to fine-tune models, enforced robust API security via key-based authentication, rate limiting, and CORS, and designed a DynamoDB schema with composite keys to effectively track per-user emotion history across multiple sessions.",
      tags: ["AWS", "PYTHON", "JAVASCRIPT", "DYNAMODB", "BEDROCK"],
      github: "https://github.com/tanmaygarg06/VibeCheck",
      demo: ""
    },
    {
      title: "Real-Time Stock Analyzer",
      year: "2026",
      description: "Architected a Real-Time Stock Analyzer powered by a scheduled AWS Lambda pipeline that robustly ingests time-series price data for 8+ stocks into DynamoDB. Modeled DynamoDB with time-series partitioning for ultra-fast historical price lookups and enforced least-privilege IAM access. Secured the dashboard with Amazon Cognito user pools and integrated a Power BI dashboard with 5-minute refresh cycles to deliver accurate, near real-time price trend visualizations.",
      tags: ["AWS", "POWER BI", "COGNITO"],
      github: "https://github.com/tanmaygarg06/Real-Time-Stock-Dashboard",
      demo: ""
    }
  ],
  skills: [
    { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
    { name: "Power BI", logo: "/powerbi.svg" },
    { name: "Excel", logo: "https://img.icons8.com/color/48/microsoft-excel-2019--v1.png" },
    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" }
  ],
  social: {
    email: "tanmaylkgarg@gmail.com",
    github: "https://github.com/tanmaygarg06",
    linkedin: "https://www.linkedin.com/in/garg-tanmay/",
    twitter: "#",
    codolio: "https://codolio.com/profile/tanmay_garg06"
  },
  education: [
    { degree: "B.Tech – Computer Science and Engineering", school: "ABES Engineering College, Ghaziabad", year: "2024–2028" },
    { degree: "Class 12 – CBSE", school: "Sunder Deep World School", year: "2024" },
    { degree: "Class 10 – CBSE", school: "Sunder Deep World School", year: "2022" }
  ],
  certifications: [
    { title: "AWS Certified Solution Architect", issuer: "Amazon Web Services", date: "Scheduled in 2026" },
    { title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2026", link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/13f9e7a1db604feb89ecf8b4699a04c5" },
    { title: "IOT and Industry (4.0)", issuer: "NPTEL", date: "2025" },
    { title: "AWS Academy Graduate Cloud Architecting", issuer: "Amazon Web Services", date: "2025", link: "https://www.credly.com/badges/89d99c22-6691-48a9-8e4d-1bff35b3e0ca/public_url" },
    { title: "AWS Academy Graduate Cloud Foundations", issuer: "Amazon Web Services", date: "2025", link: "https://www.credly.com/badges/157cb358-9756-4bca-9559-2a0391f77c74/public_url" }
  ]
};

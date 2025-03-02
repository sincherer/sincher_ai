const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
let PORT = process.env.PORT || 3001;

// Move these before the static file serving
app.use(cors());
app.use(express.json());

// API endpoints first
app.get('/api/chat', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'personalData.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const response = generateResponse(req.query.query, data);
    res.json({ response });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Static file serving after API routes
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

function startServer(port) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

// Add the generateResponse function
function generateResponse(query, data) {
  const queryLower = query.toLowerCase();
  
  // Introduction and self-description
  if ((queryLower.includes('introduce') || queryLower.includes('about you')) && 
      !queryLower.includes('specific')) {
    return `💡 I'm Sin Cher, a Senior UI/UX Designer with expertise in fintech, B2B platforms, and product design for multi-sided ecosystems. I specialize in design systems, user research, and data-driven UX strategies. My work involves bridging user needs with business goals, ensuring seamless and scalable experiences.`;
  }
  
  // Industry experience
  if (queryLower.includes('industr')) {
    return `💡 I've worked in fintech, B2B SaaS, and platform-based products. My experience includes automating workflows, building data dashboards, and improving user engagement. I also have experience with GA & GTM integration, helping companies optimize their UX through data-driven insights.`;
  }
  
  // Design philosophy
  if (queryLower.includes('philosophy') || 
      (queryLower.includes('design') && queryLower.includes('approach'))) {
    return `💡 I believe in functional, scalable, and intuitive design. A good design isn't just visually appealing—it should solve real problems efficiently. My approach is centered on user research, rapid prototyping, and iterative testing to ensure a seamless user experience.`;
  }
  
  // Design process
  if (queryLower.includes('process') || queryLower.includes('methodology')) {
    return `💡 My process typically follows these steps:\n\n` +
           `1. Understanding user needs – Conduct research through user interviews, analytics, and competitor analysis.\n` +
           `2. Defining the problem – Create user personas, journey maps, and problem statements.\n` +
           `3. Ideation & Wireframing – Sketch possible solutions and create low-fidelity wireframes.\n` +
           `4. Prototyping & Testing – Build interactive prototypes and conduct usability testing.\n` +
           `5. Iterating & Hand-off – Gather feedback, refine, and collaborate with developers for implementation.\n` +
           `6. Measuring impact – Use metrics (e.g., conversion rates, task completion time) to assess success.`;
  }
  
  // Success metrics
  if (queryLower.includes('measure') && queryLower.includes('success')) {
    return `💡 I use a combination of quantitative and qualitative metrics:\n\n` +
           `📊 User engagement (click-through rates, session duration)\n` +
           `📈 Conversion rates (sign-ups, transactions)\n` +
           `🎯 Usability metrics (task completion rate, error rate)\n` +
           `💬 Customer feedback & NPS\n\n` +
           `I also leverage GA, GTM, and Looker Studio dashboards to track UX performance and identify areas for improvement.`;
  }
  
  // Leadership experience
  if (queryLower.includes('lead') || 
      (queryLower.includes('team') && queryLower.includes('experience'))) {
    return `💡 I have led projects where I collaborated with designers, developers, and product managers to build user-centered experiences. I focus on fostering a design-driven culture, ensuring that design decisions are backed by research and aligned with business goals.`;
  }
  
  // Add communication & leadership response
  if ((queryLower.includes('communication') || queryLower.includes('leadership')) && 
      queryLower.includes('apply')) {
    const currentJob = data.experience.find(exp => exp.duration.includes('Present'));
    return `Let me share how I apply communication & leadership skills in my role as ${currentJob.position} at ${currentJob.company}! 🎯\n\n` +
      `🤝 Communication Excellence:\n` +
      `• Lead cross-functional team meetings and design reviews\n` +
      `• Present design solutions to stakeholders and executives\n` +
      `• Create clear documentation for design systems and guidelines\n` +
      `• Facilitate workshops and brainstorming sessions\n\n` +
      `👥 Leadership Impact:\n` +
      `• Mentor junior designers and provide constructive feedback\n` +
      `• Drive design initiatives from concept to implementation\n` +
      `• Build consensus among different stakeholders\n` +
      `• Champion user-centered design practices\n\n` +
      `🌟 Recent Example:\n` +
      `Recently led a major design system overhaul, coordinating with multiple teams and ensuring clear communication throughout the process.\n\n` +
      `Would you like to know more about any specific aspect of my leadership approach? 💫`;
  }
  
  // Add conflict resolution response
  if (queryLower.includes('communicate') || 
      queryLower.includes('stakeholder') || 
      queryLower.includes('collaboration') || 
      queryLower.includes('team')) {
    const currentJob = data.experience.find(exp => exp.duration.includes('Present'));
    return `As a ${currentJob.position}, effective stakeholder communication is a key part of my role! 🤝\n\n` +
      `In my current position at ${currentJob.company}, I:\n\n` +
      `✓ Collaborate closely with developers, product managers, and business analysts\n` +
      `✓ Lead design reviews and present solutions to stakeholders\n` +
      `✓ Maintain clear documentation and design systems\n` +
      `✓ Ensure consistent communication across all platforms\n\n` +
      `🛠️ I use these tools for effective communication:\n` +
      `• Figma for design collaboration\n` +
      `• JIRA for task tracking\n` +
      `• Slack/Teams for daily communication\n` +
      `• Google Meet/Zoom for remote meetings\n\n` +
      `Would you like to know more about how I handle specific stakeholder interactions? 💫`;
  }
  
  // Handle questions about current role
  if (query.includes('current') || query.includes('now') || 
      query.includes('present') || query.includes('doing')) {
    const currentJob = data.experience.find(exp => exp.duration.includes('Present'));
    if (currentJob) {
      return `I'm currently working as a ${currentJob.position} at ${currentJob.company}! 🚀\n\n` +
        `My role involves ${currentJob.description.toLowerCase()}. Let me share some exciting things I'm working on:\n\n` +
        `🌟 Key Responsibilities:\n` +
        `${currentJob.highlights.map(h => `✓ ${h}\n`).join('')}\n\n` +
        (currentJob.technologies ? 
          `🛠️ I work with these technologies:\n${currentJob.technologies.join(' • ')}\n\n` : '') +
        `Would you like to know more about any specific aspect of my role? 💡`;
    }
  }

  // Handle company-specific questions
  const companies = data.experience.map(exp => exp.company.toLowerCase());
  const companyMatch = companies.find(company => query.includes(company.toLowerCase()));
  
  if (companyMatch) {
    const exp = data.experience.find(e => e.company.toLowerCase() === companyMatch);
    return `Let me tell you about my exciting role at ${exp.company}! 🎯\n\n` +
      `As a ${exp.position}, I was responsible for ${exp.description.toLowerCase()}\n\n` +
      `🌟 Here are some of my key achievements:\n\n` +
      `${exp.highlights.map(h => `✓ ${h}\n`).join('')}\n\n` +
      (exp.technologies ? 
        `🛠️ Technologies I worked with:\n${exp.technologies.join(' • ')}\n\n` : '') +
      `Is there anything specific about this role you'd like to know more about? 💫`;
  }
  // Update the who are you condition to use queryLower
  if (queryLower.includes('who') && queryLower.includes('you')) {
    return `Hey there! 👋 I'm thrilled to tell you about ${data.basics.name}! As a ${data.basics.title}, they're doing amazing things in the design world. ${data.basics.summary}`;
  }
  
  // Update all other conditions to use queryLower
  if (queryLower.includes('experience') || queryLower.includes('work')) {
    const experiences = data.experience.map(exp => 
      `\n\n✨ *${exp.position}* at *${exp.company}*\n\n` +
      `🌍 ${exp.location} | 💼 ${exp.type}\n\n` +
      `🗓️ ${exp.duration}\n\n` +
      `${exp.description}\n\n` +
      `🌟 Awesome Achievements:\n\n` +
      `${exp.highlights.map(h => `✓ ${h}\n`).join('')}\n` +
      (exp.technologies ? `🛠️ Tech Stack: ${exp.technologies.join(' • ')}\n\n` : '') +
      `${`✧`.repeat(40)}\n\n`
    ).join('\n');
    
    return `📚 Let me walk you through ${data.basics.name}'s incredible journey!\n\n${experiences}\n\nWant to know more about any specific role? Just ask! 🚀`;
  }
  if (queryLower.includes('skill') || queryLower.includes('technical')) {
    const hardSkills = `🎯 Design & UX (Expert)\n` +
      `   • User Interface (UI) Design\n` +
      `   • User Experience (UX) Design\n` +
      `   • Product Design & Thinking\n` +
      `   • Design Systems\n` +
      `   • Interaction Design\n` +
      `   • Wireframing & Prototyping\n` +
      `   • AI in UIUX Design\n` +
      `   • Content Strategy\n` +
      `   • User Research\n` +
      `   • Visual Design\n\n` +
      `🎯 Development (Proficient)\n` +
      `   • HTML & CSS\n` +
      `   • React\n` +
      `   • Angular\n` +
      `   • Vue\n\n` +
      `🎯 Media Production (Skilled)\n` +
      `   • Videography\n` +
      `   • Photography\n\n` +
      `🎯 Professional Tools\n` +
      `   • Design: Figma, Figjam, Adobe XD\n` +
      `   • Graphics: Adobe Illustrator\n` +
      `   • Video: Adobe Premiere Pro, After Effects\n` +
      `   • Analytics: Google Analytics, Tag Manager, Looker Studio\n` +
      `   • Automation: Google Sheet Automation\n\n` +
      `🎯 Soft Skills\n` +
      `   • Communication & Leadership\n` +
      `   • Problem Solving & Critical Thinking\n` +
      `   • Adaptability & Initiative\n` +
      `   • Collaboration & Team Management\n` +
      `   • Attention to Detail\n` +
      `   • Time Management`;

    return `💪 Let me showcase my comprehensive skill set!\n\n${hardSkills}\n\n` +
           `Want to know more about any specific skill or how I've applied these in real projects? Just ask! 🚀`;
  }
  // Remove this entire block as it's causing the syntax error
  /* const skills = data.skills.map(skill => 
      `🎯 ${skill.category} (${skill.proficiency})\n   ${skill.items.map(item => `• ${item}`).join('\n   ')}`
    ).join('\n\n');
    return `💪 Check out these amazing skills!\n\n${skills}\n\nWant to know more about any specific technology? Just ask! 🤓`;
  } */
  if (query.includes('education') || query.includes('study')) {
    const education = data.education.map(edu => 
      `🎓 ${edu.degree}\n📚 Field: ${edu.field}\n🏛️ ${edu.institution}\n📅 ${edu.year}\n${edu.achievements ? `\n🏆 Achievements:\n${edu.achievements.map(a => `   • ${a}`).join('\n')}` : ''}`
    ).join('\n\n');
    return `Here's the educational journey that shaped ${data.basics.name}'s expertise:\n\n${education}`;
  }

  if (query.includes('project')) {
    const projects = data.projects.map(proj => 
      `🚀 *${proj.name}*\n` +
      `📝 ${proj.description}\n` +
      `🛠️ Built with: ${proj.technologies.join(' • ')}\n` +
      `✨ Highlights:\n${proj.highlights.map(h => `   • ${h}`).join('\n')}`
    ).join('\n\n');
    return `Let me show you some exciting projects!\n\n${projects}\n\nWant to dive deeper into any of these? Just ask! 💡`;
  }

  if (query.includes('certification')) {
    const certs = data.certifications.map(cert => 
      `🏆 ${cert.name}\n📍 Issued by: ${cert.issuer}\n📅 ${cert.year}`
    ).join('\n\n');
    return `Check out these valuable certifications!\n\n${certs}\n\nEach of these represents dedication to professional growth! 🌱`;
  }

  return "I'm excited to help, but I'm not quite sure what you're looking for! 🤔 Try asking about experience, skills, education, projects, or certifications - I'd love to tell you more! 💫";
}

startServer(PORT);
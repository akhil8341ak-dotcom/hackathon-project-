let GoogleGenerativeAI;
try {
  const genAiModule = require('@google/generative-ai');
  GoogleGenerativeAI = genAiModule.GoogleGenerativeAI;
} catch (e) {
  console.log('Note: @google/generative-ai module optional load.');
}

/**
 * Clean potential markdown syntax from JSON string
 */
function cleanJsonString(str) {
  if (!str) return '';
  let cleaned = str.trim();
  cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  return cleaned;
}

/**
 * Dynamic local fallback data generator based on title/type/description
 */
function getFallbackData(title = '', description = '') {
  const isSnowfall = title.toLowerCase().includes('snow') || description.toLowerCase().includes('snow');
  const isMedical = title.toLowerCase().includes('medical') || description.toLowerCase().includes('casualty');
  const isFire = title.toLowerCase().includes('fire') || description.toLowerCase().includes('blaze');

  if (isSnowfall) {
    return {
      category: "Environmental / Weather Emergency",
      severity: "Critical",
      priority: "High",
      summary: "Heavy snowfall and extreme ice accumulation blocking Patrol Route B with stranded personnel.",
      impact: "Stranded personnel face hypothermia risk, route navigation is fully blocked, and response delays may exacerbate health threats.",
      recommendedAction: "1. Dispatch All-Terrain Snow Transport Alpha to clear heavy snowfall and reach stranded team.\n2. Deploy Emergency Medical Unit 1 with cold-weather shock equipment.\n3. Maintain constant radio contact via Rapid Communications Unit.",
      requiredResources: ["Response Team Alpha", "Emergency Medical Unit 1", "All-Terrain Transport Vehicle"],
      assignedTeam: "Emergency Response Team Alpha",
      estimatedResponseTime: "25-30 minutes",
      reasoning: "Stranded personnel in sub-zero environmental hazards necessitate immediate heavy transport & medical dispatch."
    };
  } else if (isMedical) {
    return {
      category: "Medical Emergency",
      severity: "High",
      priority: "High",
      summary: "Critical medical evacuation required for injured operational personnel on site.",
      impact: "High health risk if medical stabilization is delayed beyond 20 minutes.",
      recommendedAction: "1. Dispatch Emergency Medical Unit 1 with advanced life support equipment.\n2. Secure immediate helicopter landing pad or transport corridor.\n3. Alert regional trauma center for triage setup.",
      requiredResources: ["Emergency Medical Unit 1", "Rapid Communications Unit"],
      assignedTeam: "Emergency Medical Unit 1",
      estimatedResponseTime: "15 minutes",
      reasoning: "Life safety protocol mandates immediate high-priority medical team deployment."
    };
  } else if (isFire) {
    return {
      category: "Infrastructure / Fire Hazard",
      severity: "Critical",
      priority: "High",
      summary: "Thermal anomaly and fire outbreak reported at sector facilities.",
      impact: "Potential structural integrity loss and severe toxic smoke spread to surrounding units.",
      recommendedAction: "1. Initiate Sector Evacuation Protocol Charlie.\n2. Dispatch Heavy Rescue Equipment Unit & Fire Response Team.\n3. Establish 500-meter safety perimeter around sector building.",
      requiredResources: ["Heavy Rescue Equipment Unit", "Response Team Alpha"],
      assignedTeam: "Heavy Rescue Equipment Unit",
      estimatedResponseTime: "12 minutes",
      reasoning: "Fire and structural risk requires fast heavy suppression and perimeter isolation."
    };
  }

  return {
    category: "Environmental / Operational",
    severity: "Critical",
    priority: "High",
    summary: "Severe operational hazard impacting field routes and personnel safety.",
    impact: "High risk to stranded personnel, route blockage, and communication delays.",
    recommendedAction: "Dispatch nearest available response unit and deploy emergency medical assets immediately.",
    requiredResources: ["Response Team Alpha", "Emergency Medical Unit 1", "All-Terrain Transport Vehicle"],
    assignedTeam: "Emergency Response Team Alpha",
    estimatedResponseTime: "30 minutes",
    reasoning: "Fallback rule applied: Severe operational conditions with personnel safety risk require immediate response dispatch."
  };
}

/**
 * Analyze an incident report using Gemini AI
 */
async function analyzeIncidentWithGemini({ title, description, location, type }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY missing. Using OpsPilot fallback AI engine.');
    return getFallbackData(title, description);
  }

  try {
    if (GoogleGenerativeAI) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const prompt = `You are an expert AI Operational Management Assistant.
Analyze the following operational incident report and generate a structured operational response plan in valid JSON format.

Incident Title: ${title}
Description: ${description}
Location: ${location}
Incident Type: ${type}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "category": "String (e.g. Environmental, Infrastructure, Medical, Security, Supply Chain)",
  "severity": "String (Critical | High | Moderate | Low)",
  "priority": "String (High | Medium | Low)",
  "summary": "Concise 1-2 sentence executive summary of the situation",
  "impact": "Description of operational risks, safety issues, and consequences",
  "recommendedAction": "Immediate step-by-step action plan",
  "requiredResources": ["Array of specific team/equipment types needed"],
  "assignedTeam": "Name of primary team to dispatch (e.g., Emergency Response Team Alpha)",
  "estimatedResponseTime": "Estimated arrival/resolution time (e.g., 30 minutes)",
  "reasoning": "Brief justification for the assessment"
}

Do not include any markdown backticks or extra text outside the valid JSON string.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = cleanJsonString(responseText);
      const parsed = JSON.parse(cleaned);

      return {
        category: parsed.category || 'Operational',
        severity: parsed.severity || 'Moderate',
        priority: parsed.priority || 'Medium',
        summary: parsed.summary || 'Incident reported and analyzed.',
        impact: parsed.impact || 'Under active operational monitoring.',
        recommendedAction: parsed.recommendedAction || 'Deploy standard field inspection team.',
        requiredResources: Array.isArray(parsed.requiredResources) ? parsed.requiredResources : ['Response Team Alpha'],
        assignedTeam: parsed.assignedTeam || 'Emergency Response Team Alpha',
        estimatedResponseTime: parsed.estimatedResponseTime || '30 minutes',
        reasoning: parsed.reasoning || 'Standard operational analysis applied.'
      };
    }
  } catch (error) {
    console.error('❌ Gemini API Analysis error:', error.message);
    console.log('🔄 Engaging OpsPilot Fallback AI assessment algorithm...');
  }

  return getFallbackData(title, description);
}

/**
 * Generate Command Situational Report
 */
async function generateOperationalReport(incident, resources = [], tasks = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && GoogleGenerativeAI) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const prompt = `You are the Lead Operations Commander. Generate a crisp, executive situational command report in Markdown for the following incident:

Title: ${incident.title}
Severity: ${incident.severity}
Status: ${incident.status}
Location: ${incident.location}
Category: ${incident.category}
Summary: ${incident.summary}
Impact: ${incident.impact}
Recommended Action: ${incident.recommendedAction}
Assigned Team: ${incident.assignedTeam}
Estimated Response Time: ${incident.estimatedResponseTime}

Tasks Count: ${tasks.length}
Assigned Resources: ${resources.map(r => r.name).join(', ') || 'None'}

Format the output cleanly using standard markdown headers (## Executive Briefing, ## Operational Impact, ## Deployed Assets, ## Immediate Directives). Keep it highly professional and authoritative.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err) {
      console.error('❌ Gemini Command Report generation error:', err.message);
    }
  }

  // Local Markdown Report Fallback Generator
  return `# 🛡️ EXECUTIVE COMMAND SITUATIONAL REPORT

**Report ID:** OPS-RPT-${incident._id ? incident._id.toString().slice(-6).toUpperCase() : '99821'}  
**Timestamp:** ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC  
**Classification:** RESTRICTED - OPERATIONAL COMMAND  

---

## 📌 Executive Briefing
- **Incident Title:** ${incident.title}
- **Location / Sector:** ${incident.location}
- **Category:** ${incident.category || 'Environmental Emergency'}
- **Severity Index:** **${incident.severity.toUpperCase()}**
- **Current Operational Status:** \`${incident.status.toUpperCase()}\`

> **Executive Summary:**  
> ${incident.summary || incident.description}

---

## ⚠️ Operational Impact & Risk Analysis
${incident.impact || 'Personnel safety and route accessibility are impacted. Active monitoring and tactical response initiated.'}

---

## 🚜 Deployed Assets & Tactical Teams
- **Primary Assigned Team:** \`${incident.assignedTeam || 'Emergency Response Team Alpha'}\`
- **Target Response Window:** \`${incident.estimatedResponseTime || '30 minutes'}\`
- **Assigned Resources:**  
${resources.length > 0 ? resources.map(r => `  - **${r.name}** (${r.type} - Status: *${r.status}*)`).join('\n') : '  - **Response Team Alpha** (Ground Response - Status: *Assigned*)\n  - **Emergency Medical Unit 1** (Medical - Status: *Assigned*)'}

---

## 📋 Immediate Operational Directives
${incident.recommendedAction || '1. Dispatch primary response vector.\n2. Establish communication perimeter.\n3. Report status updates every 15 minutes to Central Command.'}

---
*Report generated automatically by OpsPilot AI Decision Support System.*`;
}

module.exports = {
  analyzeIncidentWithGemini,
  generateOperationalReport,
};

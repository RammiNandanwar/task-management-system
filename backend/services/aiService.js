const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeResume = async (
    resumeText,
    jobDescription
) => {
    const prompt = `
You are an AI-powered Applicant Tracking System.

Analyze the candidate resume against the job description.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Return ONLY valid JSON using this exact structure:

{
    "matchScore": 0,
    "skills": [],
    "experience": "",
    "strengths": [],
    "missingSkills": [],
    "summary": ""
}

Rules:

- matchScore must be between 0 and 100.
- skills must contain relevant skills found in the resume.
- experience must describe relevant experience found in the resume.
- strengths must contain relevant strengths.
- missingSkills must contain important skills required by the job but missing or weak in the resume.
- summary must briefly explain the candidate's suitability.
- Do not invent information.
- Return JSON only.
`;

    try {
        console.log("Calling Gemini API...");

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        console.log("Gemini response received.");

        let output = response.text;

        if (!output) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        output = output.trim();

        // Remove markdown code fences if Gemini returns them
        if (output.startsWith("```json")) {
            output = output
                .replace("```json", "")
                .replace("```", "")
                .trim();
        }

        if (output.startsWith("```")) {
            output = output
                .replace("```", "")
                .trim();
        }

        const analysis = JSON.parse(output);

        return analysis;

    } catch (error) {

        console.error(
            "Gemini API error:"
        );

        console.error(error);

        throw new Error(
            `Gemini AI analysis failed: ${error.message}`
        );
    }
};

module.exports = analyzeResume;
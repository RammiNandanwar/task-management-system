const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractResumeText = async (filePath) => {
    let parser;

    try {
        // Read the uploaded PDF
        const fileBuffer = fs.readFileSync(filePath);

        // Create PDF parser
        parser = new PDFParse({
            data: fileBuffer
        });

        // Extract text
        const result = await parser.getText();

        const text = result.text
            .replace(/\r\n/g, "\n")
            .replace(/[ \t]+/g, " ")
            .trim();

        if (!text) {
            throw new Error(
                "No readable text found in the PDF"
            );
        }

        return text;

    } catch (error) {
        throw new Error(
            `Failed to extract resume text: ${error.message}`
        );

    } finally {
        // Free parser resources
        if (parser) {
            await parser.destroy();
        }
    }
};

module.exports = extractResumeText;
import fs from 'fs';

const sourceFileToConvert = 'reports/htmlhint-report.json';
const destinationFile = 'reports/sonar-htmlhint-report.json';

// Docs for format on https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/importing-external-issues/generic-issue-import-format/

// Read the htmlhint-report.json file
const htmlhintReport = JSON.parse(fs.readFileSync(sourceFileToConvert, 'utf8'));

// Extract unique rules from the messages
const uniqueRules = {};
htmlhintReport.forEach(item => {
    item.messages.forEach(message => {
        if (!uniqueRules[message.rule.id]) {
            uniqueRules[message.rule.id] = {
                id: message.rule.id,
                name: message.rule.name || message.rule.id,
                description: message.rule.description || '',
                engineId: 'htmlhint',
                cleanCodeAttribute: 'CONVENTIONAL',
                impacts: [{
                    "softwareQuality": "MAINTAINABILITY",
                    "severity": "HIGH"
                }] // fixed all impact on high
            };
        }
    });
});

const rules = Object.values(uniqueRules);

// Convert the array of messages into the required object format -> this is some copilot magic with flatmap and map, I was going to nest some foreaches and figure it out later :)
const sonarReport = {
    rules: rules,
    issues: htmlhintReport.flatMap(item =>
        item.messages.map(message => ({
            ruleId: message.rule.id,
            primaryLocation: {
                message: message.message,
                filePath: item.file,
                textRange: {
                    startLine: message.line,
                    startColumn: message.col
                }
            }
        }))
    )
};

// Write the converted content to sonar-htmlhint-report.json
fs.writeFileSync(destinationFile, JSON.stringify(sonarReport, null, 2));
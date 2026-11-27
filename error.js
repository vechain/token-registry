/**
 * Build the string message
 * @param {{ tokenPath: string; error: import('zod').ZodError }} param0 
 */
const buildMessage = ({ tokenPath, error }) => {
    const base = `Error validating ${tokenPath}:\n`
    return base + error.issues.map(issue => `Issue (${issue.message}) at: ${issue.path.join('->')}`).join('\n')
}


class InvalidAdditionalSchemaError extends Error {
    constructor({
        tokenPath,
        error
    }) {
        super(buildMessage({tokenPath, error}))
    }
}

module.exports = {
    InvalidAdditionalSchemaError
}
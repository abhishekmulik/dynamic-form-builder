interface JSONValidationResult {
    isValid: boolean;
    error?: string;
    parsedData?: unknown;
    isObject?: boolean;
}

/**
 * Validates JSON input with comprehensive error checking
 * @param input - The JSON string to validate
 * @param options - Validation options
 * @returns Validation result object
 */
export function validateJSON(
    input: string,
    options: {
        requireObject?: boolean;
        requireNonEmpty?: boolean;
        allowedTypes?: ('object' | 'array' | 'string' | 'number' | 'boolean' | 'null')[];
    } = {}
): JSONValidationResult {
    const {
        requireObject = true,
        requireNonEmpty = false,
        allowedTypes = ['object', 'array']
    } = options;

    // Empty input check
    if (input.trim() === '') {
        return {
            isValid: !requireNonEmpty,
            error: requireNonEmpty ? 'Input cannot be empty' : undefined
        };
    }

    // Try parsing
    let parsed: any;
    try {
        parsed = JSON.parse(input);
    } catch (err) {
        return {
            isValid: false,
            error: err instanceof Error ? err.message : 'Invalid JSON format'
        };
    }

    if (!Array.isArray(parsed?.fields)) {
        return {
            isValid: false,
            error: `Define the input fields as an array in the property 'fields'`,
            parsedData: parsed
        }
    }

    if (!parsed.formTitle) {
        return {
            isValid: false,
            error: `'formTitle'' field is mandatory`,
            parsedData: parsed
        }
    }


    // Type checking
    const type = Array.isArray(parsed) ? 'array' : typeof parsed === 'object' && parsed !== null ? 'object' : typeof parsed;

    if (!allowedTypes.includes(type as any)) {
        return {
            isValid: false,
            error: `Invalid type: ${type}. Allowed types: ${allowedTypes.join(', ')}`,
            parsedData: parsed
        };
    }

    // Object requirement check
    if (requireObject && type !== 'object' && type !== 'array') {
        return {
            isValid: false,
            error: 'Input must be a JSON object or array',
            parsedData: parsed,
            isObject: false
        };
    }

    // Non-empty object/array check
    if (requireNonEmpty && (type === 'object' || type === 'array')) {
        const isEmpty = type === 'object'
            ? Object.keys(parsed as object).length === 0
            : (parsed as unknown[]).length === 0;

        if (isEmpty) {
            return {
                isValid: false,
                error: 'Object/array cannot be empty',
                parsedData: parsed,
                isObject: type === 'object'
            };
        }
    }

    return {
        isValid: true,
        parsedData: parsed,
        isObject: type === 'object'
    };
}
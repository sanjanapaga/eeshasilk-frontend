/**
 * Parses error responses into a human-readable string.
 * Handles strings, standard objects, and CodeIgniter validation error objects.
 */
export const parseError = (error) => {
    if (!error) return 'An unknown error occurred';

    if (typeof error === 'string') return error;

    // If it's a CodeIgniter failing validation/response object
    if (typeof error === 'object') {
        // Handle { messages: { field1: "error", field2: "error" } }
        if (error.messages && typeof error.messages === 'object') {
            return Object.values(error.messages).join(' ');
        }

        // Handle { error: "message" } or { message: "message" }
        if (error.error && typeof error.error === 'string') return error.error;
        if (error.message && typeof error.message === 'string') return error.message;

        // Fallback for other object types
        try {
            return JSON.stringify(error);
        } catch (e) {
            return 'An error occurred (unparseable object)';
        }
    }

    return String(error);
};

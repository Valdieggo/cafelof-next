// utils/validateFields.ts
export function validateRequiredFields(body: Record<string, any>, requiredFields: string[]): string[] {
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });

    return missingFields;
}

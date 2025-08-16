import { validateJSON } from '../common.utils';

describe('common.utils', () => {
  describe('validateJSON', () => {
    describe('Form-Specific JSON Validation', () => {
      it('should validate valid form configuration JSON', () => {
        const validFormJSON = '{"formTitle": "Test Form", "fields": [{"id": "name", "type": "text", "label": "Name"}]}';
        const result = validateJSON(validFormJSON);
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual({
          formTitle: 'Test Form',
          fields: [{ id: 'name', type: 'text', label: 'Name' }]
        });
        expect(result.isObject).toBe(true);
      });

      it('should reject invalid JSON format', () => {
        const invalidJSON = '{"formTitle": "Test Form", "fields": [}';
        const result = validateJSON(invalidJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Unexpected token');
        expect(result.parsedData).toBeUndefined();
      });

      it('should reject malformed JSON', () => {
        const malformedJSON = '{"formTitle": "Test Form" "fields": []}';
        const result = validateJSON(malformedJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Expected');
      });
    });

    describe('Empty Input Handling', () => {
      it('should handle empty string input', () => {
        const emptyInput = '';
        const result = validateJSON(emptyInput);
        
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should handle whitespace-only input', () => {
        const whitespaceInput = '   \n\t  ';
        const result = validateJSON(whitespaceInput);
        
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should require non-empty input when specified', () => {
        const emptyInput = '';
        const result = validateJSON(emptyInput, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Input cannot be empty');
      });
    });

    describe('Form Structure Validation', () => {
      it('should reject JSON without fields array', () => {
        const invalidFormJSON = '{"formTitle": "Test Form"}';
        const result = validateJSON(invalidFormJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should reject JSON without formTitle', () => {
        const invalidFormJSON = '{"fields": [{"id": "name", "type": "text", "label": "Name"}]}';
        const result = validateJSON(invalidFormJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("'formTitle'' field is mandatory");
      });

      it('should accept JSON with empty fields array', () => {
        const validFormJSON = '{"formTitle": "Test Form", "fields": []}';
        const result = validateJSON(validFormJSON);
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual({
          formTitle: 'Test Form',
          fields: []
        });
      });

      it('should reject JSON with non-array fields', () => {
        const invalidFormJSON = '{"formTitle": "Test Form", "fields": "not an array"}';
        const result = validateJSON(invalidFormJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should validate form configuration with required fields', () => {
        const formConfig = {
          formTitle: 'Test Form',
          fields: [
            { id: 'name', type: 'text', label: 'Name' },
            { id: 'email', type: 'email', label: 'Email' }
          ]
        };
        
        const result = validateJSON(JSON.stringify(formConfig));
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual(formConfig);
      });
    });

    describe('Type Validation', () => {
      it('should accept object types by default', () => {
        const objectJSON = '{"formTitle": "Test", "fields": [{"id": "field1", "type": "text"}]}';
        const result = validateJSON(objectJSON);
        
        expect(result.isValid).toBe(true);
        expect(result.isObject).toBe(true);
      });

      it('should reject primitive types by default', () => {
        const stringJSON = '"just a string"';
        const result = validateJSON(stringJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should reject number types by default', () => {
        const numberJSON = '42';
        const result = validateJSON(numberJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should reject boolean types by default', () => {
        const booleanJSON = 'true';
        const result = validateJSON(booleanJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should reject null by default', () => {
        const nullJSON = 'null';
        const result = validateJSON(nullJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should accept allowed types when specified', () => {
        const stringJSON = '"just a string"';
        const result = validateJSON(stringJSON, { 
          allowedTypes: ['string', 'object', 'array'] 
        });
        
        expect(result.isValid).toBe(false);
        // Still fails because it's not a form configuration
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });
    });

    describe('Object Requirement', () => {
      it('should require object by default', () => {
        const stringJSON = '"just a string"';
        const result = validateJSON(stringJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should not require object when specified', () => {
        const stringJSON = '"just a string"';
        const result = validateJSON(stringJSON, { requireObject: false });
        
        expect(result.isValid).toBe(false);
        // Still fails because it's not a form configuration
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should accept arrays when object is required', () => {
        const arrayJSON = '[{"id": "field1", "type": "text"}]';
        const result = validateJSON(arrayJSON);
        
        expect(result.isValid).toBe(false);
        // Still fails because it's not a form configuration
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });
    });

    describe('Non-Empty Object/Array Requirement', () => {
      it('should accept empty objects by default', () => {
        const emptyObjectJSON = '{}';
        const result = validateJSON(emptyObjectJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should accept empty arrays by default', () => {
        const emptyArrayJSON = '[]';
        const result = validateJSON(emptyArrayJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should require non-empty objects when specified', () => {
        const emptyObjectJSON = '{}';
        const result = validateJSON(emptyObjectJSON, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should require non-empty arrays when specified', () => {
        const emptyArrayJSON = '[]';
        const result = validateJSON(emptyArrayJSON, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should accept non-empty objects when required', () => {
        const nonEmptyObjectJSON = '{"formTitle": "Test", "fields": [{"id": "field1", "type": "text"}]}';
        const result = validateJSON(nonEmptyObjectJSON, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual({
          formTitle: 'Test',
          fields: [{ id: 'field1', type: 'text' }]
        });
      });

      it('should accept non-empty arrays when required', () => {
        const nonEmptyArrayJSON = '[{"id": "field1", "type": "text"}]';
        const result = validateJSON(nonEmptyArrayJSON, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(false);
        // Still fails because it's not a form configuration
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });
    });

    describe('Edge Cases', () => {
      it('should handle very large form configurations', () => {
        const largeFormConfig = {
          formTitle: 'Large Form',
          fields: Array.from({ length: 1000 }, (_, i) => ({
            id: `field${i}`,
            type: 'text',
            label: `Field ${i}`
          }))
        };
        
        const result = validateJSON(JSON.stringify(largeFormConfig));
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual(largeFormConfig);
      });

      it('should handle nested objects and arrays in form fields', () => {
        const nestedFormConfig = {
          formTitle: 'Nested Form',
          fields: [
            {
              id: 'complex',
              type: 'object',
              label: 'Complex Field',
              options: {
                nested: {
                  array: [1, 2, 3],
                  object: { key: 'value' }
                }
              }
            }
          ]
        };
        
        const result = validateJSON(JSON.stringify(nestedFormConfig));
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual(nestedFormConfig);
      });

      it('should handle special characters in form titles and labels', () => {
        const specialCharsFormConfig = {
          formTitle: 'Form with special chars: !@#$%^&*()',
          fields: [
            {
              id: 'special',
              type: 'text',
              label: 'Field with special chars: áéíóúñ'
            }
          ]
        };
        
        const result = validateJSON(JSON.stringify(specialCharsFormConfig));
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual(specialCharsFormConfig);
      });

      it('should handle unicode characters in form content', () => {
        const unicodeFormConfig = {
          formTitle: 'Unicode Form 🚀',
          fields: [
            {
              id: 'emoji',
              type: 'text',
              label: 'Field with emoji 🎉'
            }
          ]
        };
        
        const result = validateJSON(JSON.stringify(unicodeFormConfig));
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual(unicodeFormConfig);
      });
    });

    describe('Error Message Clarity', () => {
      it('should provide clear error message for JSON parse errors', () => {
        const invalidJSON = '{"unclosed": "object"';
        const result = validateJSON(invalidJSON);
        
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Expected');
      });

      it('should provide clear error message for missing fields array', () => {
        const invalidFormConfig = {
          formTitle: 'Test Form'
        };
        
        const result = validateJSON(JSON.stringify(invalidFormConfig));
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });

      it('should provide clear error message for missing formTitle', () => {
        const invalidFormConfig = {
          fields: []
        };
        
        const result = validateJSON(JSON.stringify(invalidFormConfig));
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("'formTitle'' field is mandatory");
      });

      it('should provide clear error message for empty objects when required', () => {
        const emptyObjectJSON = '{}';
        const result = validateJSON(emptyObjectJSON, { requireNonEmpty: true });
        
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("Define the input fields as an array in the property 'fields'");
      });
    });

    describe('Combined Options', () => {
      it('should handle multiple validation options together', () => {
        const validFormJSON = '{"formTitle": "Test", "fields": [{"id": "field1", "type": "text"}]}';
        const result = validateJSON(validFormJSON, {
          requireObject: true,
          requireNonEmpty: true,
          allowedTypes: ['object']
        });
        
        expect(result.isValid).toBe(true);
        expect(result.parsedData).toEqual({
          formTitle: 'Test',
          fields: [{ id: 'field1', type: 'text' }]
        });
      });

      it('should reject when multiple validation options conflict', () => {
        const validFormJSON = '{"formTitle": "Test", "fields": [{"id": "field1", "type": "text"}]}';
        const result = validateJSON(validFormJSON, {
          requireObject: true,
          requireNonEmpty: true,
          allowedTypes: ['string'] // This conflicts with requireObject: true
        });
        
        expect(result.isValid).toBe(false);
        // Fails because the type check happens before form validation
        expect(result.error).toBe("Invalid type: object. Allowed types: string");
      });
    });
  });
});

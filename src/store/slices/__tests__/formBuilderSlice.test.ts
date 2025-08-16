import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer, {
  setJsonInput,
  setError,
  setParsedFormData,
  setLoading,
  updateFormField,
  setFormErrors,
  clearConfiguration,
  clearForm
} from '../formBuilderSlice';

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      formBuilder: formBuilderReducer
    }
  });
};

describe('formBuilderSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().formBuilder;
      expect(state).toEqual({
        jsonInput: '',
        error: '',
        parsedFormData: null,
        isLoading: false,
        formData: {},
        formErrors: {},
        isFormValid: true
      });
    });
  });

  describe('Basic Actions', () => {
    it('should handle setJsonInput', () => {
      const jsonInput = '{"formTitle": "Test", "fields": []}';
      store.dispatch(setJsonInput(jsonInput));
      
      const state = store.getState().formBuilder;
      expect(state.jsonInput).toBe(jsonInput);
      expect(state.error).toBe('');
    });

    it('should handle setError', () => {
      const errorMessage = 'Invalid JSON format';
      store.dispatch(setError(errorMessage));
      
      const state = store.getState().formBuilder;
      expect(state.error).toBe(errorMessage);
    });

    it('should handle setLoading', () => {
      store.dispatch(setLoading(true));
      
      const state = store.getState().formBuilder;
      expect(state.isLoading).toBe(true);
    });

    it('should handle clearConfiguration', () => {
      // First set some data
      store.dispatch(setJsonInput('{"formTitle": "Test", "fields": []}'));
      store.dispatch(setError('Some error'));
      store.dispatch(setLoading(true));
      
      // Then clear
      store.dispatch(clearConfiguration());
      
      const state = store.getState().formBuilder;
      expect(state).toEqual({
        jsonInput: '',
        error: '',
        parsedFormData: null,
        isLoading: false,
        formData: {},
        formErrors: {},
        isFormValid: true
      });
    });

    it('should handle clearForm', () => {
      // Set some form data
      store.dispatch(setParsedFormData({
        formTitle: 'Test Form',
        fields: [
          { id: 'name', type: 'text', label: 'Name' },
          { id: 'email', type: 'email', label: 'Email' }
        ]
      }));
      
      // Update some fields
      store.dispatch(updateFormField({ fieldId: 'name', value: 'John' }));
      store.dispatch(updateFormField({ fieldId: 'email', value: 'john@example.com' }));
      
      // Clear form
      store.dispatch(clearForm());
      
      const state = store.getState().formBuilder;
      expect(state.formData.name).toBe('');
      expect(state.formData.email).toBe('');
    });
  });

  describe('Conditional Logic - Field Visibility', () => {
    it('should show non-conditional fields by default', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'name', type: 'text', label: 'Name' },
          { id: 'email', type: 'email', label: 'Email' }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      const state = store.getState().formBuilder;
      expect(state.formData.name).toBe('');
      expect(state.formData.email).toBe('');
      expect(state.parsedFormData).toEqual(formConfig);
    });

    it('should handle equals operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'businessName',
            type: 'text',
            label: 'Business Name',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'business',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only non-conditional fields should be visible
      expect(state.formData.userType).toBe('');
      expect(state.formData.businessName).toBeUndefined();

      // Update userType to 'business' - should show businessName field
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe('business');
      expect(state.formData.businessName).toBe('');
    });

    it('should handle not_equals operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'individualName',
            type: 'text',
            label: 'Individual Name',
            conditional: {
              field: 'userType',
              operator: 'not_equals',
              value: 'business',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, both fields should be visible (userType is empty, not equals 'business')
      expect(state.formData.userType).toBe('');
      expect(state.formData.individualName).toBe('');

      // Update userType to 'business' - should hide individualName field
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe('business');
      expect(state.formData.individualName).toBeUndefined();
    });

    it('should handle contains operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'interests', type: 'checkbox_group', label: 'Interests' },
          {
            id: 'techDetails',
            type: 'text',
            label: 'Tech Details',
            conditional: {
              field: 'interests',
              operator: 'contains',
              value: 'technology',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only non-conditional fields should be visible
      expect(state.formData.interests).toEqual([]);
      expect(state.formData.techDetails).toBeUndefined();

      // Update interests to include 'technology' - should show techDetails field
      store.dispatch(updateFormField({ fieldId: 'interests', value: ['sports', 'technology'] }));
      
      state = store.getState().formBuilder;
      expect(state.formData.interests).toEqual(['sports', 'technology']);
      expect(state.formData.techDetails).toBe('');
    });

    it('should handle greater_than operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'age', type: 'number', label: 'Age' },
          {
            id: 'parentName',
            type: 'text',
            label: 'Parent Name',
            conditional: {
              field: 'age',
              operator: 'less_than',
              value: 18,
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, both fields should be visible (age is empty, less than 18)
      expect(state.formData.age).toBe('');
      expect(state.formData.parentName).toBe('');

      // Update age to 20 - should hide parentName field
      store.dispatch(updateFormField({ fieldId: 'age', value: 20 }));
      
      state = store.getState().formBuilder;
      expect(state.formData.age).toBe(20);
      expect(state.formData.parentName).toBeUndefined();
    });

    it('should handle is_empty operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'phone', type: 'tel', label: 'Phone' },
          {
            id: 'alternativeContact',
            type: 'text',
            label: 'Alternative Contact',
            conditional: {
              field: 'phone',
              operator: 'is_empty',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, both fields should be visible (phone is empty)
      expect(state.formData.phone).toBe('');
      expect(state.formData.alternativeContact).toBe('');

      // Update phone - should hide alternativeContact field
      store.dispatch(updateFormField({ fieldId: 'phone', value: '123-456-7890' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.phone).toBe('123-456-7890');
      expect(state.formData.alternativeContact).toBeUndefined();
    });

    it('should handle is_not_empty operator correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'email', type: 'email', label: 'Email' },
          {
            id: 'emailConfirmation',
            type: 'email',
            label: 'Confirm Email',
            conditional: {
              field: 'email',
              operator: 'is_not_empty',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only email should be visible (email is empty)
      expect(state.formData.email).toBe('');
      expect(state.formData.emailConfirmation).toBeUndefined();

      // Update email - should show emailConfirmation field
      store.dispatch(updateFormField({ fieldId: 'email', value: 'test@example.com' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.email).toBe('test@example.com');
      expect(state.formData.emailConfirmation).toBe('');
    });

    it('should handle hide action correctly', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'adminFields',
            type: 'text',
            label: 'Admin Fields',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'admin',
              action: 'hide'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, both fields should be visible (userType is empty, not equals 'admin')
      expect(state.formData.userType).toBe('');
      expect(state.formData.adminFields).toBe('');

      // Update userType to 'admin' - should hide adminFields field
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'admin' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe('admin');
      expect(state.formData.adminFields).toBeUndefined();
    });
  });

  describe('Default Values', () => {
    it('should set correct default values for different field types', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'name', type: 'text', label: 'Name', defaultValue: 'John Doe' },
          { id: 'age', type: 'number', label: 'Age', defaultValue: 25 },
          { id: 'isActive', type: 'checkbox', label: 'Active', defaultValue: true },
          { id: 'interests', type: 'checkbox_group', label: 'Interests', defaultValue: ['sports'] }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      const state = store.getState().formBuilder;
      expect(state.formData.name).toBe('John Doe');
      expect(state.formData.age).toBe(25);
      expect(state.formData.isActive).toBe(true);
      expect(state.formData.interests).toEqual(['sports']);
    });

    it('should handle conditional fields with default values', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'businessName',
            type: 'text',
            label: 'Business Name',
            defaultValue: 'Default Business',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'business',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only userType should be visible
      expect(state.formData.userType).toBe('');
      expect(state.formData.businessName).toBeUndefined();

      // Update userType to 'business' - should show businessName with default value
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe('business');
      expect(state.formData.businessName).toBe('Default Business');
    });
  });

  describe('Field Updates and Conditional Logic', () => {
    it('should handle multiple conditional dependencies', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          { id: 'hasEmployees', type: 'checkbox', label: 'Has Employees' },
          {
            id: 'employeeCount',
            type: 'number',
            label: 'Employee Count',
            conditional: {
              field: 'hasEmployees',
              operator: 'equals',
              value: true,
              action: 'show'
            }
          },
          {
            id: 'businessName',
            type: 'text',
            label: 'Business Name',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'business',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only non-conditional fields should be visible
      expect(state.formData.userType).toBe('');
      expect(state.formData.hasEmployees).toBe(false);
      expect(state.formData.employeeCount).toBeUndefined();
      expect(state.formData.businessName).toBeUndefined();

      // Update userType to 'business' - should show businessName
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.businessName).toBe('');

      // Update hasEmployees to true - should show employeeCount
      store.dispatch(updateFormField({ fieldId: 'hasEmployees', value: true }));
      
      state = store.getState().formBuilder;
      expect(state.formData.employeeCount).toBe('');

      // Update userType back to 'individual' - should hide businessName
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'individual' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.businessName).toBeUndefined();
      // employeeCount should still be visible since hasEmployees is still true
      expect(state.formData.employeeCount).toBe('');
    });

    it('should clear errors when conditional fields are hidden', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'businessName',
            type: 'text',
            label: 'Business Name',
            required: true,
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'business',
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      // Show businessName field
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      // Set an error for businessName
      store.dispatch(setFormErrors({ businessName: 'Business name is required' }));
      
      let state = store.getState().formBuilder;
      expect(state.formErrors.businessName).toBe('Business name is required');

      // Hide businessName field by changing userType
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'individual' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.businessName).toBeUndefined();
      expect(state.formErrors.businessName).toBeUndefined();
    });

    it('should handle nested conditional dependencies in correct order', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'hasEmployees',
            type: 'checkbox',
            label: 'Has Employees',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: 'business',
              action: 'show'
            }
          },
          {
            id: 'employeeCount',
            type: 'number',
            label: 'Employee Count',
            conditional: {
              field: 'hasEmployees',
              operator: 'equals',
              value: true,
              action: 'show'
            }
          },
          {
            id: 'employeeBenefits',
            type: 'checkbox_group',
            label: 'Employee Benefits',
            options: [
              { value: 'health', label: 'Health Insurance' },
              { value: 'dental', label: 'Dental Insurance' },
              { value: 'vision', label: 'Vision Insurance' }
            ],
            conditional: {
              field: 'employeeCount',
              operator: 'greater_than',
              value: 0,
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only userType should be visible
      expect(state.formData.userType).toBe('');
      expect(state.formData.hasEmployees).toBeUndefined();
      expect(state.formData.employeeCount).toBeUndefined();
      expect(state.formData.employeeBenefits).toBeUndefined();

      // Update userType to 'business' - should show hasEmployees
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.hasEmployees).toBe(false);
      expect(state.formData.employeeCount).toBeUndefined();
      expect(state.formData.employeeBenefits).toBeUndefined();

      // Update hasEmployees to true - should show employeeCount
      store.dispatch(updateFormField({ fieldId: 'hasEmployees', value: true }));
      
      state = store.getState().formBuilder;
      expect(state.formData.employeeCount).toBe('');
      expect(state.formData.employeeBenefits).toBeUndefined();

      // Update employeeCount to 5 - should show employeeBenefits
      store.dispatch(updateFormField({ fieldId: 'employeeCount', value: 5 }));
      
      state = store.getState().formBuilder;
      expect(state.formData.employeeBenefits).toEqual([]);

      // Test reverse order - hide employeeBenefits first
      store.dispatch(updateFormField({ fieldId: 'employeeCount', value: 0 }));
      
      state = store.getState().formBuilder;
      expect(state.formData.employeeBenefits).toBeUndefined();
      expect(state.formData.employeeCount).toBe(0);
      expect(state.formData.hasEmployees).toBe(true);

      // Hide hasEmployees
      store.dispatch(updateFormField({ fieldId: 'hasEmployees', value: false }));
      
      state = store.getState().formBuilder;
      expect(state.formData.employeeCount).toBeUndefined();
      expect(state.formData.employeeBenefits).toBeUndefined();
      expect(state.formData.hasEmployees).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should handle form errors correctly', () => {
      const errors = {
        name: 'Name is required',
        email: 'Invalid email format'
      };

      store.dispatch(setFormErrors(errors));
      
      const state = store.getState().formBuilder;
      expect(state.formErrors).toEqual(errors);
      expect(state.isFormValid).toBe(false);
    });

    it('should clear field errors when field is updated', () => {
      // First set some errors
      store.dispatch(setFormErrors({
        name: 'Name is required',
        email: 'Invalid email format'
      }));

      // Update a field - should clear its error
      store.dispatch(updateFormField({ fieldId: 'name', value: 'John' }));
      
      const state = store.getState().formBuilder;
      expect(state.formErrors.name).toBeUndefined();
      expect(state.formErrors.email).toBe('Invalid email format');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fields array', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: []
      };

      store.dispatch(setParsedFormData(formConfig));
      
      const state = store.getState().formBuilder;
      expect(state.formData).toEqual({});
      expect(state.parsedFormData).toEqual(formConfig);
    });

    it('should handle null/undefined values in conditional rules', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          { id: 'userType', type: 'select', label: 'User Type' },
          {
            id: 'businessName',
            type: 'text',
            label: 'Business Name',
            conditional: {
              field: 'userType',
              operator: 'equals',
              value: null,
              action: 'show'
            }
          }
        ]
      };

      store.dispatch(setParsedFormData(formConfig));
      
      let state = store.getState().formBuilder;
      // Initially, only userType should be visible (userType is empty string, not null)
      expect(state.formData.userType).toBe('');
      expect(state.formData.businessName).toBeUndefined();

      // Update userType to null - should show businessName field
      store.dispatch(updateFormField({ fieldId: 'userType', value: null }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe(null);
      expect(state.formData.businessName).toBe('');

      // Update userType to 'business' - should hide businessName field
      store.dispatch(updateFormField({ fieldId: 'userType', value: 'business' }));
      
      state = store.getState().formBuilder;
      expect(state.formData.userType).toBe('business');
      expect(state.formData.businessName).toBeUndefined();
    });

    it('should handle circular dependencies gracefully', () => {
      const formConfig = {
        formTitle: 'Test Form',
        fields: [
          {
            id: 'fieldA',
            type: 'text',
            label: 'Field A',
            conditional: {
              field: 'fieldB',
              operator: 'equals',
              value: 'show',
              action: 'show'
            }
          },
          {
            id: 'fieldB',
            type: 'text',
            label: 'Field B',
            conditional: {
              field: 'fieldA',
              operator: 'equals',
              value: 'show',
              action: 'show'
            }
          }
        ]
      };

      // This should not cause infinite loops
      expect(() => {
        store.dispatch(setParsedFormData(formConfig));
      }).not.toThrow();
      
      const state = store.getState().formBuilder;
      // Only non-conditional fields should be visible initially
      expect(state.formData.fieldA).toBeUndefined();
      expect(state.formData.fieldB).toBeUndefined();
    });
  });
});

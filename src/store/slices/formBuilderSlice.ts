import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConditionalRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
  action: 'show' | 'hide';
}

interface FormBuilderState {
  jsonInput: string;
  error: string;
  parsedFormData: any;
  isLoading: boolean;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  isFormValid: boolean;
}

// Conditional rendering logic engine
const evaluateCondition = (rule: ConditionalRule, formData: Record<string, any>): boolean => {
  const dependentFieldValue = formData[rule.field];
  switch (rule.operator) {
    case 'equals':
      return dependentFieldValue === rule.value;
    case 'not_equals':
      return dependentFieldValue !== rule.value;
    case 'contains':
      if (Array.isArray(dependentFieldValue)) {
        return dependentFieldValue.includes(rule.value);
      }
      return String(dependentFieldValue).includes(String(rule.value));
    case 'greater_than':
      return Number(dependentFieldValue) > Number(rule.value);
    case 'less_than':
      return Number(dependentFieldValue) < Number(rule.value);
    case 'is_empty':
      return !dependentFieldValue || 
             (Array.isArray(dependentFieldValue) && dependentFieldValue.length === 0) ||
             String(dependentFieldValue).trim() === '';
    case 'is_not_empty':
      return !!dependentFieldValue && 
             (!Array.isArray(dependentFieldValue) || dependentFieldValue.length > 0) &&
             String(dependentFieldValue).trim() !== '';
    default:
      return true;
  }
};

// Check if a field should be visible
const isFieldVisible = (field: any, formData: Record<string, any>): boolean => {
  if (!field.conditional) return true;
  const shouldShow = evaluateCondition(field.conditional, formData);
  return field.conditional.action === 'show' ? shouldShow : !shouldShow;
};

// Get visible fields only, considering dependencies
const getVisibleFields = (fields: any[]): any[] => {
  const visibleFields: any[] = [];
  const tempFormData: Record<string, any> = {};
  
  // Helper function to get default value for a field
  const getDefaultValue = (field: any): any => {
    if (field.defaultValue !== undefined) return field.defaultValue;
    
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'checkbox_group':
        return [];
      case 'number':
        return '';
      default:
        return '';
    }
  };
  
  // Build dependency graph and find evaluation order
  const dependencyGraph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  // Initialize in-degree for all fields
  fields.forEach(field => {
    inDegree.set(field.id, 0);
    dependencyGraph.set(field.id, []);
  });
  
  // Build dependency graph
  fields.forEach(field => {
    if (field.conditional && field.conditional.field) {
      const dependencyId = field.conditional.field;
      if (dependencyGraph.has(dependencyId)) {
        dependencyGraph.get(dependencyId)!.push(field.id);
        inDegree.set(field.id, (inDegree.get(field.id) || 0) + 1);
      }
    }
  });
  
  // Topological sort using Kahn's algorithm
  const queue: string[] = [];
  const evaluationOrder: string[] = [];
  
  // Add fields with no dependencies to queue
  fields.forEach(field => {
    if (inDegree.get(field.id) === 0) {
      queue.push(field.id);
    }
  });
  
  while (queue.length > 0) {
    const currentFieldId = queue.shift()!;
    evaluationOrder.push(currentFieldId);
    
    // Process dependencies
    const dependents = dependencyGraph.get(currentFieldId) || [];
    dependents.forEach(dependentId => {
      inDegree.set(dependentId, inDegree.get(dependentId)! - 1);
      if (inDegree.get(dependentId) === 0) {
        queue.push(dependentId);
      }
    });
  }
  
  // Process fields in dependency order
  evaluationOrder.forEach(fieldId => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    if (!field.conditional) {
      // Non-conditional fields are always visible
      visibleFields.push(field);
      tempFormData[field.id] = getDefaultValue(field);
    } else {
      // Conditional fields - check if they should be visible
      if (isFieldVisible(field, tempFormData)) {
        visibleFields.push(field);
        tempFormData[field.id] = getDefaultValue(field);
      }
    }
  });
  
  return visibleFields;
};

const initialState: FormBuilderState = {
  jsonInput: '',
  error: '',
  parsedFormData: null,
  isLoading: false,
  formData: {},
  formErrors: {},
  isFormValid: true,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setJsonInput: (state, action: PayloadAction<string>) => {
      state.jsonInput = action.payload;
      state.error = ''; // Clear error when input changes
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setParsedFormData: (state, action: PayloadAction<any>) => {
      state.parsedFormData = action.payload;
      state.error = ''; // Clear error when data is successfully parsed
      // Initialize form data with default values for visible fields only
      if (action.payload && action.payload.fields) {
        const visibleFields = getVisibleFields(action.payload.fields);
        const defaultData: Record<string, any> = {};
        
        visibleFields.forEach((field: any) => {
          const providedDefault = field?.defaultValue;
          switch (field.type) {
            case 'checkbox_group': {
              if (providedDefault !== undefined) {
                // Accept array defaults; if single value is provided, coerce to array
                defaultData[field.id] = Array.isArray(providedDefault)
                  ? providedDefault
                  : [providedDefault];
              } else {
                defaultData[field.id] = [];
              }
              break;
            }
            case 'checkbox': {
              defaultData[field.id] = providedDefault !== undefined ? Boolean(providedDefault) : false;
              break;
            }
            case 'number': {
              // Preserve empty state as '' to allow clearing, otherwise use provided number
              if (providedDefault !== undefined && providedDefault !== null && providedDefault !== '') {
                defaultData[field.id] = Number(providedDefault);
              } else {
                defaultData[field.id] = '';
              }
              break;
            }
            case 'radio':
            case 'select':
            case 'date':
            case 'text':
            case 'email':
            case 'tel':
            case 'password':
            case 'textarea': {
              defaultData[field.id] = providedDefault !== undefined ? providedDefault : '';
              break;
            }
            default: {
              defaultData[field.id] = providedDefault !== undefined ? providedDefault : '';
            }
          }
        });
        state.formData = defaultData;
        state.formErrors = {};
        state.isFormValid = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateFormField: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.formData[fieldId] = value;
      
      // Check if any conditional fields should be shown/hidden based on this change
      if (state.parsedFormData && state.parsedFormData.fields) {
        const fields = state.parsedFormData.fields;
        
        // Check each conditional field to see if its visibility changed
        fields.forEach((field: any) => {
          if (field.conditional && field.conditional.field === fieldId) {
            const shouldBeVisible = isFieldVisible(field, state.formData);
            const isCurrentlyInFormData = field.id in state.formData;
            
            if (shouldBeVisible && !isCurrentlyInFormData) {
              // Field should be visible but isn't in formData - add it
              const providedDefault = field?.defaultValue;
              switch (field.type) {
                case 'checkbox_group': {
                  state.formData[field.id] = providedDefault !== undefined 
                    ? (Array.isArray(providedDefault) ? providedDefault : [providedDefault])
                    : [];
                  break;
                }
                case 'checkbox': {
                  state.formData[field.id] = providedDefault !== undefined ? Boolean(providedDefault) : false;
                  break;
                }
                case 'number': {
                  state.formData[field.id] = (providedDefault !== undefined && providedDefault !== null && providedDefault !== '')
                    ? Number(providedDefault)
                    : '';
                  break;
                }
                default: {
                  state.formData[field.id] = providedDefault !== undefined ? providedDefault : '';
                }
              }
            } else if (!shouldBeVisible && isCurrentlyInFormData) {
              // Field should be hidden but is in formData - remove it
              delete state.formData[field.id];
              // Also clear any errors for this field
              if (state.formErrors[field.id]) {
                delete state.formErrors[field.id];
              }
            }
          }
        });
      }
      
      // Clear field error when user starts typing
      if (state.formErrors[fieldId]) {
        delete state.formErrors[fieldId];
      }
    },
    setFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.formErrors = action.payload;
      state.isFormValid = Object.keys(action.payload).length === 0;
    },
    clearConfiguration: (state) => {
      state.jsonInput = '';
      state.error = '';
      state.parsedFormData = null;
      state.isLoading = false;
      state.formData = {};
      state.formErrors = {};
      state.isFormValid = true;
    },
    clearForm:(state)=>{
      // Clear form data but maintain conditional field visibility
      if (state.parsedFormData && state.parsedFormData.fields) {
        const fields = state.parsedFormData.fields;
        
        // Clear only the fields that should currently be visible
        Object.keys(state.formData).forEach(key => {
          const field = fields.find((f: any) => f.id === key);
          if (field) {
            // Reset to default value instead of clearing completely
            const providedDefault = field?.defaultValue;
            switch (field.type) {
              case 'checkbox_group': {
                state.formData[key] = providedDefault !== undefined 
                  ? (Array.isArray(providedDefault) ? providedDefault : [providedDefault])
                  : [];
                break;
              }
              case 'checkbox': {
                state.formData[key] = providedDefault !== undefined ? Boolean(providedDefault) : false;
                break;
              }
              case 'number': {
                state.formData[key] = (providedDefault !== undefined && providedDefault !== null && providedDefault !== '')
                  ? Number(providedDefault)
                  : '';
                break;
              }
              default: {
                state.formData[key] = providedDefault !== undefined ? providedDefault : '';
              }
            }
          }
        });
      } else {
        // If no parsed form data, just clear everything
        Object.keys(state.formData).forEach(key => {
          state.formData[key] = '';
        });
      }
      
      // Clear all form errors
      state.formErrors = {};
      state.isFormValid = true;
    }
  },
})

export const {
  setJsonInput,
  setError,
  setParsedFormData,
  setLoading,
  updateFormField,
  setFormErrors,
  clearConfiguration,
  clearForm
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;

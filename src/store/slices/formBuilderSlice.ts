import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormBuilderState {
  jsonInput: string;
  error: string;
  parsedFormData: any;
  isLoading: boolean;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  isFormValid: boolean;
}

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
      // Initialize form data with default values
      if (action.payload && action.payload.fields) {
        const defaultData: Record<string, any> = {};
        action.payload.fields.forEach((field: any) => {
          if (field.type === 'checkbox_group') {
            defaultData[field.id] = [];
          } else if (field.type === 'number') {
            defaultData[field.id] = '';
          } else {
            defaultData[field.id] = '';
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
      // Clear field error when user starts typing
      if (state.formErrors[fieldId]) {
        delete state.formErrors[fieldId];
      }
    },
    setFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.formErrors = action.payload;
      state.isFormValid = Object.keys(action.payload).length === 0;
    },
    clearForm: (state) => {
      state.jsonInput = '';
      state.error = '';
      state.parsedFormData = null;
      state.isLoading = false;
      state.formData = {};
      state.formErrors = {};
      state.isFormValid = true;
    },
  },
});

export const {
  setJsonInput,
  setError,
  setParsedFormData,
  setLoading,
  updateFormField,
  setFormErrors,
  clearForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;

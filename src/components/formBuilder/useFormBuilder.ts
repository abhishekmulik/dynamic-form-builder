import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setJsonInput, 
  setError, 
  setParsedFormData, 
  clearConfiguration,
  clearForm 
} from '../../store/slices/formBuilderSlice';
import { validateJSON } from '../../utils/common.utils';
import { useCallback } from 'react';

export const useFormBuilder = () => {
  const dispatch = useAppDispatch();
  const { 
    jsonInput, 
    error, 
    parsedFormData, 
    formData, 
    formErrors, 
    isFormValid 
  } = useAppSelector((state) => state.formBuilder);

  const handleJsonChange = useCallback((value: string) => {
    dispatch(setJsonInput(value));
  }, [dispatch]);

  const handleLoadConfiguration = useCallback((value: string) => {
    const parsedJson = validateJSON(value);
    if (parsedJson.error) {
      dispatch(setError(parsedJson.error));
      return;
    }
    dispatch(setParsedFormData(parsedJson.parsedData));
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearConfiguration());
  }, [dispatch]);

  const handleFormSubmit = useCallback((data: Record<string, any>) => {
    console.log('Form submitted with data:', data);
    dispatch(clearForm());
  }, [dispatch]);

  return {
    // State
    jsonInput,
    error,
    parsedFormData,
    formData,
    formErrors,
    isFormValid,
    
    // Actions
    handleJsonChange,
    handleLoadConfiguration,
    handleClear,
    handleFormSubmit,
  };
};

import React, { useEffect } from 'react';
import { Box, Button, Text, Heading, VStack } from '@chakra-ui/react';
import { FormField } from '../molecules/FormField';
import { LabeledField } from '../molecules/LabeledField';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateFormField, setFormErrors } from '../../../store';

export interface ConditionalRule {
  field: string;           // Which field to check
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;             // Value to compare against (not needed for is_empty/is_not_empty)
  action: 'show' | 'hide';
}

export interface FormFieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'select' | 'radio' | 'checkbox_group' | 'checkbox' | 'textarea';
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditional?: ConditionalRule;  // New: conditional rendering rule
}

export interface FormConfig {
  formTitle?: string;
  fields: FormFieldConfig[];
  submitButton?: {
    text?: string;
    variant?: string;
  };
}

export interface DynamicFormProps {
  config: FormConfig;
  onSubmit?: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  initialValues = {},
}) => {
  const dispatch = useAppDispatch();
  const { formData, formErrors, isFormValid } = useAppSelector((state) => state.formBuilder);

  // Conditional rendering logic engine
  const evaluateCondition = (rule: ConditionalRule): boolean => {
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
  const isFieldVisible = (field: FormFieldConfig): boolean => {
    if (!field.conditional) return true;
    const shouldShow = evaluateCondition(field.conditional);
    return field.conditional.action === 'show' ? shouldShow : !shouldShow;
  };

  // Get visible fields only
  const visibleFields = config.fields.filter(isFieldVisible);

  useEffect(() => {
    // Initialize form data with default values
    if (Object.keys(initialValues).length > 0) {
      Object.entries(initialValues).forEach(([fieldId, value]) => {
        dispatch(updateFormField({ fieldId, value }));
      });
    }
  }, [initialValues, dispatch]);

  const validateField = (field: FormFieldConfig, value: any): string => {
    console.log(field, value)
    if (field.required && (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length))) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern } = field.validation;

      if (min !== undefined && value < min) {
        return `${field.label} must be at least ${min}`;
      }

      if (max !== undefined && value > max) {
        return `${field.label} must be at most ${max}`;
      }

      if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
        return field.validation.message || `${field.label} format is invalid`;
      }
    }

    return '';
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormField({ fieldId, value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    config.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    dispatch(setFormErrors(newErrors));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit?.(formData);
  };

  if (!config || !config.fields || config?.fields?.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text color="gray.500">No form configuration provided</Text>
      </Box>
    );
  }
  console.log({isFormValid, formData}, 'visibleFields');
  return (
    <Box as="form" p={6}>
      {config.formTitle && (
        <Heading size="lg" mb={6} textAlign="center">
          {config.formTitle}
        </Heading>
      )}
      
      <VStack spacing={4} align="stretch">
        {visibleFields.map((field) => {
         // For single checkboxes, we don't need LabeledField wrapper since the checkbox has its own label
          if (field.type === 'checkbox') {
            return (
              <FormField
                key={field.id}
                id={field.id}
                type={field.type}
                value={formData[field.id] || false}
                onChange={(value) => handleFieldChange(field.id, value)}
                required={field.required}
                placeholder={field.placeholder}
                error={formErrors[field.id]}
                disabled={field.disabled}
                options={field.options}
                rows={field.rows}
                validation={field.validation}
                label={field.label} // Pass label for single checkbox
              />
            );
          }
          
          // For all other fields, use LabeledField wrapper
          return (
            <LabeledField
              key={field.id}
              label={field.label}
              isRequired={field.required}
              error={formErrors[field.id]}
            >
              <FormField
                id={field.id}
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(value) => handleFieldChange(field.id, value)}
                required={field.required}
                placeholder={field.placeholder}
                error={formErrors[field.id]}
                disabled={field.disabled}
                options={field.options}
                rows={field.rows}
                validation={field.validation}
              />
            </LabeledField>
          );
        })}
        
        <Button
          colorScheme="secondary"
          size="lg"
          mt={6}
          onClick={handleSubmit}
        >
          {config.submitButton?.text || 'Submit'}
        </Button>
      </VStack>
    </Box>
  );
};

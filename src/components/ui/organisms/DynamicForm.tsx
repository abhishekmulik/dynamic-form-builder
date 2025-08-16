import React, { useMemo } from 'react';
import { Box, Button, Text, Heading, VStack } from '@chakra-ui/react';
import { FormField } from '../molecules/FormField';
import { LabeledField } from '../molecules/LabeledField';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateFormField, setFormErrors } from '../../../store';
import { FieldType, OperatorType } from '../../../types/common.types';

export interface ConditionalRule {
  field: string;         
  operator: OperatorType
  value?: any;
  action: 'show' | 'hide';
}

export interface FormFieldConfig {
  id: string;
  type: FieldType
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
    value?: boolean; 
  };
  conditional?: ConditionalRule;
  defaultValue?: any;
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
  config?: FormConfig;
  onSubmit?: (data: Record<string, any>) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
}) => {
  const dispatch = useAppDispatch();
  
  const { formData, formErrors, isFormValid } = useAppSelector((state) => state.formBuilder);
  const visibleFields = useMemo(() => {
    return config?.fields.filter(field => field.id in formData) || [];
  }, [config?.fields, formData]);

  const validateField = (field: FormFieldConfig, value: any): string => {
    console.log(field, value)

    // Handle required field validation
    if (field.required && (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length))) {
      return `${field.label} is required`;
    }

    // Handle checkbox validation for required boolean values
    if (field.type === 'checkbox' && field.validation && field.validation.value !== undefined) {
      const requiredValue = field.validation.value;
      if (value !== requiredValue) {
        return field.validation.message || `${field.label} must be ${requiredValue ? 'checked' : 'unchecked'}`;
      }
    }

    // Handle other validation rules
    if (field.validation && field.required) {
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

    // Only validate fields that are currently in formData (visible fields)
    Object.keys(formData).forEach((fieldId) => {
      const field = config?.fields.find(f => f.id === fieldId);
      if (field) {
        const error = validateField(field, formData[fieldId]);
        if (error) {
          newErrors[fieldId] = error;
          isValid = false;
        }
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

  return (
    <React.Fragment>
      <Box as="form" p={6}>
        {config.formTitle && (
          <Heading size="lg" mb={6} textAlign="center">
            {config.formTitle}
          </Heading>
        )}

        <VStack gap={1} align="stretch">
          {visibleFields.map((field) => {
            if (field.type === 'checkbox') {
              return (
                <FormField
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  value={formData[field.id] ?? false}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  error={formErrors[field.id]}
                  disabled={field.disabled}
                  options={field.options}
                  rows={field.rows}
                  validation={field.validation}
                  label={field.label} 
                />
              );
            }
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
                  value={formData[field.id] ?? ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  error={formErrors[field.id]}
                  disabled={field.disabled}
                  options={field.options}
                  rows={field.rows}
                  validation={field.validation}
                  label={field.label}
                />
              </LabeledField>
            );
          })}

          <Button
            colorScheme="secondary"
            size="lg"
            mt={6}
            onClick={handleSubmit}
            disabled={Object.keys(formErrors).length > 0}
          >
            {config.submitButton?.text || 'Submit'}
          </Button>
        </VStack>
      </Box>
    </React.Fragment>
  );
};

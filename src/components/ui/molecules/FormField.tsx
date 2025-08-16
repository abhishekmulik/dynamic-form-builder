import React from 'react';
import { Input, Select, RadioGroup, CheckboxGroup, TextArea, SingleCheckbox } from '../atoms';
import { FieldType } from '../../../types/common.types';

export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormFieldProps {
  id: string;
  type: FieldType
  value: any;
  onChange: (value: any) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  options?: FormFieldOption[];
  rows?: number;
  label?: string; // Added for single checkboxes
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  type,
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  options = [],
  rows = 4,
  label,
  error,
}) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <TextArea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            isRequired={required}
            data-testid={id}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            isRequired={required}
            isDisabled={disabled}
            data-testid={id}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={String(value || '')}
            onChange={onChange}
            options={options.map(opt => ({ value: String(opt.value), label: opt.label }))}
            isRequired={required}
            isDisabled={disabled}
            data-testid={id}
          />
        );

      case 'checkbox_group':
        return (
          <CheckboxGroup
            value={Array.isArray(value) ? value.map(v => String(v)) : []}
            onChange={onChange}
            options={options.map(opt => ({ value: String(opt.value), label: opt.label }))}
            isRequired={required}
            isDisabled={disabled}
            data-testid={id}
          />
        )
      case 'checkbox':
        return (
          <SingleCheckbox
            value={Boolean(value)}
            onChange={onChange}
            label={label}
            isRequired={required}
            isDisabled={disabled}
            isInvalid={!!error}
            data-testid={id}
          />
        );
      default:
        return (
          <Input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            isRequired={required}
            isDisabled={disabled}
            data-testid={id}
          />
        );
    }
  };

  return (
    <>
      {renderInput()}
    </>
  );
};
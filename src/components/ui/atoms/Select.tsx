import React from 'react';
import { Select as ChakraSelect } from '@chakra-ui/react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  value: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  options: SelectOption[];
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  isRequired = false,
  isDisabled = false,
  isMulti = false,
  name,
  size = 'md',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <ChakraSelect
      value={Array.isArray(value) ? value[0] : value}
      onChange={handleChange}
      placeholder={placeholder}
      isRequired={isRequired}
      isDisabled={isDisabled}
      name={name}
      size={size}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </ChakraSelect>
  );
};

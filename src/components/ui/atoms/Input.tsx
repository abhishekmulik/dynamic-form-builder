import React from 'react';
import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';

export interface InputProps extends Omit<ChakraInputProps, 'onChange'> {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date';
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder,
  isRequired = false,
  isDisabled = false,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) || '' : e.target.value;
    onChange(newValue);
  };

  return (
    <ChakraInput
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      isRequired={isRequired}
      isDisabled={isDisabled}
      {...props}
    />
  );
};

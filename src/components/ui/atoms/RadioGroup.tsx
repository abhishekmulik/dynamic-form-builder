import React from 'react';
import { RadioGroup as ChakraRadioGroup, Radio, Stack } from '@chakra-ui/react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  isRequired?: boolean;
  isDisabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  name?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  isRequired = false,
  isDisabled = false,
  direction = 'vertical',
  name,
  ...props
}) => {
  return (
    <ChakraRadioGroup
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      name={name}
      {...props}
    >
      <Stack direction={direction === 'horizontal' ? 'row' : 'column'} spacing={3}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            isRequired={isRequired}
            colorScheme="secondary"
          >
            {option.label}
          </Radio>
        ))}
      </Stack>
    </ChakraRadioGroup>
  );
};

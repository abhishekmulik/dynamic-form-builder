import React from 'react';
import { Checkbox, Stack } from '@chakra-ui/react';

export interface CheckboxOption {
  value: string | number;
  label: string;
}

export interface CheckboxGroupProps {
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  options: CheckboxOption[];
  isRequired?: boolean;
  isDisabled?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onChange,
  options,
  isRequired = false,
  isDisabled = false,
  direction = 'vertical',
}) => {
  const handleCheckboxChange = (optionValue: string | number, isChecked: boolean) => {
    if (isChecked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <Stack direction={direction === 'horizontal' ? 'row' : 'column'} spacing={3}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          isChecked={value.includes(option.value)}
          onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
          isRequired={isRequired}
          isDisabled={isDisabled}
          colorScheme="secondary"
        >
          {option.label}
        </Checkbox>
      ))}
    </Stack>
  );
};

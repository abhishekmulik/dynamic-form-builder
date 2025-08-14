import React from 'react';
import { Checkbox, Text } from '@chakra-ui/react';

export interface SingleCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export const SingleCheckbox: React.FC<SingleCheckboxProps> = ({
  value,
  onChange,
  label,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
}) => {
  const shouldShowRedLabel = isRequired && isInvalid && !value;
  
  return (
    <Checkbox
      isChecked={value}
      onChange={(e) => onChange(e.target.checked)}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      colorScheme={isInvalid ? 'red' : 'secondary'}
    >
      <Text color={shouldShowRedLabel ? 'error.500' : 'inherit'}>
        {label}
      </Text>
    </Checkbox>
  );
};

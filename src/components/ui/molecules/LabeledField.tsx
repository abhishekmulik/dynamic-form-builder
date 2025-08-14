import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    SystemStyleObject,
    Text,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

export type LabeledFieldProps = {
    label?: string;
    sx?: SystemStyleObject;
    error?: string | null | undefined;
    isRequired?: boolean;
    children: ReactNode;
    addBottomPadding?: boolean;
};

export const LabeledField: FC<LabeledFieldProps> = ({
    label,
    sx,
    error,
    isRequired,
    children,
    addBottomPadding = true,
}) => {
    const bottomPadding = addBottomPadding ? '22px' : 0;
    return (
        <FormControl sx={sx} isInvalid={Boolean(error?.length)} mb={2.5}>
            {Boolean(label) && (
                <FormLabel
                    color="secondary.700"
                    fontWeight="medium"
                    alignItems="center"
                    display="flex"
                    onClickCapture={(e) => {
                        e.preventDefault();
                    }}
                >
                    {label}
                    {isRequired && (
                        <Text color="red.400" display="inline">
                            *
                        </Text>
                    )}
                </FormLabel>
            )}
            {children}
            <Text pt={error ? 0 : bottomPadding}>
                <FormErrorMessage as="span">{error}</FormErrorMessage>
            </Text>
        </FormControl>
    );
};

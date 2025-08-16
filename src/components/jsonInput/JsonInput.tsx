import { TextArea } from '../ui/atoms'
import { LabeledField } from '../ui/molecules/LabeledField';

type JsonInputProps = {
  jsonInput: string;
  onChangeHandler: (value: string) => void;
  error: string;
}

function JsonInput({ jsonInput, onChangeHandler, error }: JsonInputProps) {
  return (
    <LabeledField label='JSON Configuration' isRequired error={error}>
      <TextArea
        value={jsonInput}
        onChange={(e) => onChangeHandler(e.target.value)}
        placeholder="Paste your form configuration JSON here..."
        fontFamily="mono"
        fontSize="sm"
        bg="white.200"
        borderColor="secondary.300"
        _hover={{ bg: "secondary.100" }}
        _focus={{ bg: "secondary.100" }}
        maxH={{ base: "40vh", md: "50vh", lg: "60vh" }}
        resize="vertical"
        overflow="auto"
        rows={23}
      />
    </LabeledField>
  )
}

export default JsonInput
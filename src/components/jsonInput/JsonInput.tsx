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
        bg="secondary.50"
        borderColor="secondary.300"
        _hover={{ bg: "secondary.100" }}
        _focus={{ bg: "white" }}
        rows={25}
        maxH="60vh"
      />
    </LabeledField>
  )
}

export default JsonInput
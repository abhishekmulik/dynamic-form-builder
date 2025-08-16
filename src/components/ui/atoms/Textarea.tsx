import { Textarea, TextareaProps } from "@chakra-ui/react";

export function TextArea(props: TextareaProps) {
  return (
    <Textarea
      placeholder="Comment..."
      _hover={{
        borderColor: "none"
      }}
      overflow="auto"
      cursor={"text"}
      {...props}
    />
  );
}
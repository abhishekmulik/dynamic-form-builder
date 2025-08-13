import { Textarea, TextareaProps } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function TextArea(props: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);

  return (
    <Textarea
      ref={textareaRef}
      placeholder="Comment..."
      borderColor="secondary.200"
      _hover={{ borderColor: "secondary.300" }}
      _focus={{
        borderColor: "primary.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)"
      }}
      transition="height 0.2s ease"
      minH="unset"
      overflow="hidden"
      resize="none"
      cursor={"text"}
      {...props}
    />
  );
}
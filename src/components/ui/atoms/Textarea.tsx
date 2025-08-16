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
      _hover={{
        borderColor: "none"
      }}
      _focus={{

      }}
      overflow="auto"
      cursor={"text"}
      {...props}
    />
  );
}
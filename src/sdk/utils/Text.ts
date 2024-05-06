export type TextSegment = {
  text: string;
  color?: string;
};

type InternalTextSegment = {
  text: string;
  tag: string | null;
  inTag: boolean;
};

export const parseText = (text: string): TextSegment[] => {
  const segments: InternalTextSegment[] = [];
  let currentSegment: InternalTextSegment = { text: "", tag: null, inTag: false };
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "<" && !currentSegment.inTag) {
      if (currentSegment.text) {
        segments.push(currentSegment);
      }
      currentSegment = { text: "", tag: "", inTag: true };
    } else if (text[i] === "/") {
        // closing tag
        if (currentSegment.text) {
          segments.push(currentSegment);
        }
    } else if (text[i] === ">") {
      currentSegment.inTag = false;
    } else if (currentSegment.inTag) {
        currentSegment.tag += text[i];
    } else {
      currentSegment.text += text[i];
    }
  }
  if (currentSegment.text) {
    segments.push(currentSegment);
  }
  return segments.map(({text, tag}) => {
    const color = parseColor(tag);
    return {
        text,
        ...(color && { color })
    };
});
};

const parseColor = (tag: string) => (tag?.includes("col=") ? tag.split("=")?.[1] : null);

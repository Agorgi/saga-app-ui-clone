import type React from 'react';
import styles from './RichTextContent.module.scss';

const POST_PREVIEW_MAX_LENGTH = 280;

interface RichTextContentProps {
  text: string;
}

// Wireframe clone: the source parses Quill ops via readQuillObj and truncates to
// constants.POST_PREVIEW_MAX_LENGTH. Here we take plain placeholder text and
// truncate the same way, keeping the same DOM and class names.
export const RichTextContent: React.FC<RichTextContentProps> = ({ text }) => {
  const truncatedText =
    text.length > POST_PREVIEW_MAX_LENGTH
      ? `${text.substring(0, POST_PREVIEW_MAX_LENGTH)}...`
      : text;

  return <div className={styles.richTextPreview}>{truncatedText}</div>;
};

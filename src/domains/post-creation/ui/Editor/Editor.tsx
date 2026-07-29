import type Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import styles from './Editor.module.scss';

interface EditorProps {
  // Clone post-creation API: a controlled textarea.
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
  // Production crowd-commission API: an uncontrolled Quill editor exposed via editorRef.
  // The clone wires a tiny fake Quill so callers that read editorRef.current.getText() /
  // getContents().ops keep working without a real Quill dependency.
  readonly editorRef?: React.RefObject<Quill | null>;
  readonly defaultValue?: { ops?: Array<Record<string, unknown>>; text?: string };
}

// Wireframe clone: the source mounts a Quill rich-text editor (QuillEditor +
// quill.snow.css) behind a memoized wrapper. The clone has no Quill dependency, so the
// editor renders a controlled textarea dressed to read as a writing surface. Same
// container classNames; visual stand-in only.
function opsToText(ops?: Array<Record<string, unknown>>): string {
  if (!Array.isArray(ops)) return '';
  return ops.map((op) => (typeof op.insert === 'string' ? op.insert : '')).join('');
}

export function Editor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  editorRef,
  defaultValue,
}: EditorProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    () => defaultValue?.text ?? opsToText(defaultValue?.ops),
  );
  const text = isControlled ? value : internal;

  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (!editorRef) return;
    const fake = {
      getText: () => textRef.current,
      getContents: () => ({ ops: textRef.current ? [{ insert: textRef.current }] : [] }),
      setContents: () => {},
      on: () => {},
      off: () => {},
      root: undefined as unknown as HTMLElement,
    };
    editorRef.current = fake as unknown as Quill;
    return () => {
      editorRef.current = null;
    };
  }, [editorRef]);

  return (
    <div className={styles.editorContainer}>
      <textarea
        className={styles.editorTextarea}
        value={text}
        onChange={(e) => {
          if (isControlled) onChange?.(e.target.value);
          else setInternal(e.target.value);
        }}
        placeholder={placeholder ?? 'Write your post...'}
        readOnly={readOnly}
      />
    </div>
  );
}

export default Editor;

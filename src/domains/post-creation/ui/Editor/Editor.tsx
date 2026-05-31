import styles from './Editor.module.scss';

interface EditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
}

// Wireframe clone: the source mounts a Quill rich-text editor (QuillEditor +
// quill.snow.css) behind a memoized wrapper. The clone has no Quill dependency,
// so the Text tab renders a controlled textarea dressed to read as a writing
// surface. Same container classNames; visual stand-in only.
export function Editor({ value, onChange, placeholder, readOnly = false }: EditorProps) {
  return (
    <div className={styles.editorContainer}>
      <textarea
        className={styles.editorTextarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Write your post...'}
        readOnly={readOnly}
      />
    </div>
  );
}

export default Editor;

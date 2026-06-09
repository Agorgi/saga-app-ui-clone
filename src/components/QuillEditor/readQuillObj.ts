// Wireframe clone: production renders rich text (Quill Delta) through readQuillObj with
// DOMPurify sanitization. Here we flatten the Delta ops to a plain string; 'html' mode
// wraps that text in a paragraph. Signature mirrors @components/QuillEditor/readQuillObj.
interface Quillish {
  ops?: Array<Record<string, unknown>>;
}

export function readQuillObj(obj: unknown, mode: 'text' | 'html' = 'text'): string {
  const ops = (obj as Quillish | null | undefined)?.ops;
  if (!Array.isArray(ops)) return '';
  const text = ops
    .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
    .join('')
    .trim();
  if (mode === 'html') {
    return text ? `<p>${text}</p>` : '';
  }
  return text;
}

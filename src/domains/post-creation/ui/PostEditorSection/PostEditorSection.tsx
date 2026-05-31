import { toast } from '@saga/global-web';
import type { PostContentUpload, RichTextContent } from '@saga/records-middleware';
import { type Ref, useCallback, useImperativeHandle, useState } from 'react';
import Editor from '../Editor/Editor';
import { PostButton } from '../shared/PostButton/PostButton';
import styles from './PostEditorSection.module.scss';

export interface PostEditorSectionHandle {
  submit: () => void;
}

interface PostEditorSectionProps {
  readonly title: string;
  readonly createPostWithContent: (content: PostContentUpload, title: string) => Promise<void>;
  readonly defaultContent?: RichTextContent;
  readonly wizardMode?: boolean;
  readonly hideSubmit?: boolean;
  readonly ref?: Ref<PostEditorSectionHandle>;
}

// Wireframe clone: the source reads Quill Delta ops off a quillRef and uploads
// rich text. Here the Editor is a controlled textarea and we move the plain
// string between wizard steps. Submit guard + imperative handle preserved.
export function PostEditorSection({
  title,
  createPostWithContent,
  defaultContent,
  wizardMode = false,
  hideSubmit = false,
  ref,
}: PostEditorSectionProps) {
  const [text, setText] = useState(() => defaultContent?.text ?? '');

  const handlePost = useCallback(async () => {
    if (!text.trim()) {
      toast.error('Please enter some content');
      return;
    }

    const content: PostContentUpload = { type: 'richText', text };
    await createPostWithContent(content, title);
  }, [createPostWithContent, text, title]);

  useImperativeHandle(ref, () => ({ submit: handlePost }), [handlePost]);

  const isPostDisabled = wizardMode ? false : !title.trim();

  return (
    <>
      <div className={styles.editorWrapper}>
        <Editor value={text} onChange={setText} placeholder="Write your post..." />
      </div>
      {!hideSubmit && (
        <PostButton
          disabled={isPostDisabled}
          onClick={handlePost}
          label={wizardMode ? 'Next' : 'Post'}
          pill={wizardMode}
        />
      )}
    </>
  );
}

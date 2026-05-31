import {
  PostEditorSection,
  type PostEditorSectionHandle,
} from '@domains/post-creation/ui/PostEditorSection/PostEditorSection';
import {
  PostImageSection,
  type PostImageSectionHandle,
} from '@domains/post-creation/ui/PostImageSection/PostImageSection';
import {
  PostVideoSection,
  type PostVideoSectionHandle,
} from '@domains/post-creation/ui/PostVideoSection/PostVideoSection';
import { Tabs } from '@saga/global-web';
import { assertNever } from '@saga/precedent-middleware';
import type {
  ImageContent,
  PostContentUpload,
  RichTextContent,
  VideoContent,
} from '@saga/records-middleware';
import { type Ref, useImperativeHandle, useRef } from 'react';
import styles from './PostForm.module.scss';

export type PostCreationTab = 'editor' | 'image' | 'video';

const TABS: Array<{ id: PostCreationTab; label: string }> = [
  { id: 'image', label: 'Image' },
  { id: 'editor', label: 'Text' },
  { id: 'video', label: 'Video' },
];

export interface PostFormHandle {
  submit: () => void;
}

interface PostFormProps {
  readonly title: string;
  readonly activeTab: PostCreationTab;
  readonly onTabChange: (tab: PostCreationTab) => void;
  readonly onSubmit: (content: PostContentUpload, title: string) => Promise<void>;
  readonly defaultContent?: RichTextContent | ImageContent | VideoContent;
  readonly wizardMode?: boolean;
  readonly hideSubmit?: boolean;
  readonly ref?: Ref<PostFormHandle>;
}

// Wireframe clone: copied near-verbatim. The three content sections sit behind
// the vendored Tabs; only the active panel is shown (the others stay mounted
// but hidden so their local state survives tab switches, matching the source).
export function PostForm({
  title,
  activeTab,
  onTabChange,
  onSubmit,
  defaultContent,
  wizardMode = false,
  hideSubmit = false,
  ref,
}: PostFormProps) {
  const editorRef = useRef<PostEditorSectionHandle>(null);
  const imageRef = useRef<PostImageSectionHandle>(null);
  const videoRef = useRef<PostVideoSectionHandle>(null);

  useImperativeHandle(ref, () => ({
    submit() {
      switch (activeTab) {
        case 'editor':
          editorRef.current?.submit();
          break;
        case 'image':
          imageRef.current?.submit();
          break;
        case 'video':
          videoRef.current?.submit();
          break;
        default:
          assertNever(activeTab);
      }
    },
  }));

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
        ariaLabel="Post content type"
        tabsContainerClassName={styles.tabs}
      >
        {() => (
          <div className={styles.tabContent}>
            <div
              className={`${styles.tabPanel} ${activeTab === 'editor' ? styles.tabPanelActive : styles.tabPanelHidden}`}
            >
              <PostEditorSection
                ref={editorRef}
                title={title}
                createPostWithContent={onSubmit}
                defaultContent={defaultContent?.type === 'richText' ? defaultContent : undefined}
                wizardMode={wizardMode}
                hideSubmit={hideSubmit}
              />
            </div>
            <div
              className={`${styles.tabPanel} ${activeTab === 'image' ? styles.tabPanelActive : styles.tabPanelHidden}`}
            >
              <PostImageSection
                ref={imageRef}
                title={title}
                activeTab={activeTab}
                createPostWithContent={onSubmit}
                defaultContent={defaultContent?.type === 'image' ? defaultContent : undefined}
                wizardMode={wizardMode}
                hideSubmit={hideSubmit}
              />
            </div>
            <div
              className={`${styles.tabPanel} ${activeTab === 'video' ? styles.tabPanelActive : styles.tabPanelHidden}`}
            >
              <PostVideoSection
                ref={videoRef}
                title={title}
                activeTab={activeTab}
                createPostWithContent={onSubmit}
                defaultContent={defaultContent?.type === 'video' ? defaultContent : undefined}
                wizardMode={wizardMode}
                hideSubmit={hideSubmit}
              />
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}

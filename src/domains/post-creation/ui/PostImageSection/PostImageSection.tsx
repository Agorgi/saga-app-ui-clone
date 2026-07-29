import { EmblaCarousel, toast } from '@saga/global-web';
import type { ImageContent, PostContentUpload } from '@saga/records-middleware';
import { type Ref, useCallback, useId, useImperativeHandle, useState } from 'react';
import { DragDropZone } from '../DragDropZone/DragDropZone';
import sharedStyles from '../shared/MediaSection.module.scss';
import { PostButton } from '../shared/PostButton/PostButton';
import styles from './PostImageSection.module.scss';

const CAROUSEL_OPTIONS = { loop: false };

export interface PostImageSectionHandle {
  submit: () => void;
}

interface PostImageSectionProps {
  readonly title: string;
  readonly activeTab: string;
  readonly createPostWithContent: (content: PostContentUpload, title: string) => Promise<void>;
  readonly defaultContent?: ImageContent;
  readonly wizardMode?: boolean;
  readonly hideSubmit?: boolean;
  readonly ref?: Ref<PostImageSectionHandle>;
}

// Wireframe clone: the source uploads images via useImageUploads (size/type
// validation + network upload) and tracks events. Here selected files become
// local object URLs for preview only — no upload, no network. DOM + classNames
// (DragDropZone, EmblaCarousel "embla--small", caption) match the source.
export function PostImageSection({
  title,
  activeTab,
  createPostWithContent,
  defaultContent,
  wizardMode = false,
  hideSubmit = false,
  ref,
}: PostImageSectionProps) {
  const [images, setImages] = useState<string[]>(() => defaultContent?.images ?? []);
  const [caption, setCaption] = useState(() => defaultContent?.description ?? '');
  const captionId = useId();

  const handleImageUpload = (files: FileList) => {
    if (files.length === 0) return;

    if (activeTab !== 'image') {
      toast.error('Please switch to the Image tab to upload images');
      return;
    }

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleRemoveImages = () => {
    setImages([]);
  };

  const handlePost = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const content: PostContentUpload = {
      type: 'image',
      images,
      description: caption.trim(),
    };

    await createPostWithContent(content, title);
  }, [caption, createPostWithContent, images, title]);

  useImperativeHandle(ref, () => ({ submit: handlePost }), [handlePost]);

  const isPostDisabled = (wizardMode ? false : !title.trim()) || images.length === 0;

  return (
    <>
      <div className={sharedStyles.mediaWrapper}>
        {images.length === 0 && (
          <div className={sharedStyles.mediaUploadSection}>
            <p className={sharedStyles.mediaUploadLabel}>Upload Images</p>
            <div className={styles.dropSquare}>
              <DragDropZone
                onFilesSelected={handleImageUpload}
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                multiple
                disabled={false}
              />
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className={sharedStyles.mediaPreviewContainer}>
            <EmblaCarousel
              images={images}
              options={CAROUSEL_OPTIONS}
              showDots={images.length > 1}
              className="embla--small"
            />
            <button
              type="button"
              onClick={handleRemoveImages}
              className={sharedStyles.removeButton}
            >
              Remove Images
            </button>
          </div>
        )}

        <div className={sharedStyles.captionSection}>
          <label htmlFor={captionId} className={sharedStyles.captionLabel}>
            Caption (optional)
          </label>
          <textarea
            id={captionId}
            className={sharedStyles.captionInput}
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
          />
        </div>
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

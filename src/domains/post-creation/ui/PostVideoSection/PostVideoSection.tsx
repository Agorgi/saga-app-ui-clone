import { toast } from '@saga/global-web';
import type { PostContentUpload, VideoContent } from '@saga/records-middleware';
import { type Ref, useCallback, useId, useImperativeHandle, useState } from 'react';
import { DragDropZone } from '../DragDropZone/DragDropZone';
import sharedStyles from '../shared/MediaSection.module.scss';
import { PostButton } from '../shared/PostButton/PostButton';
import styles from './PostVideoSection.module.scss';

export interface PostVideoSectionHandle {
  submit: () => void;
}

interface PostVideoSectionProps {
  readonly title: string;
  readonly activeTab: string;
  readonly createPostWithContent: (content: PostContentUpload, title: string) => Promise<void>;
  readonly defaultContent?: VideoContent;
  readonly wizardMode?: boolean;
  readonly hideSubmit?: boolean;
  readonly ref?: Ref<PostVideoSectionHandle>;
}

// Wireframe clone: the source validates/reads the file as a data URL and can
// auto-generate a thumbnail from the video. Here the selected video/image
// become local object URLs for preview only — no upload, no thumbnail codec
// work. DOM + classNames (video preview, optional preview image) match source.
export function PostVideoSection({
  title,
  activeTab,
  createPostWithContent,
  defaultContent,
  wizardMode = false,
  hideSubmit = false,
  ref,
}: PostVideoSectionProps) {
  const [video, setVideo] = useState<string | undefined>(() => defaultContent?.video);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    () => defaultContent?.previewImage,
  );
  const [caption, setCaption] = useState(() => defaultContent?.description ?? '');
  const captionId = useId();

  const handleVideoUpload = (files: FileList) => {
    if (files.length === 0) return;

    if (activeTab !== 'video') {
      toast.error('Please switch to the Video tab to upload videos');
      return;
    }

    const file = files[0];
    if (!file) return;
    setVideo(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    setVideo(undefined);
    setPreviewImage(undefined);
  };

  const handlePreviewImageUpload = (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleRemovePreviewImage = () => {
    setPreviewImage(undefined);
  };

  const handlePost = useCallback(async () => {
    if (!video) {
      toast.error('Please upload a video');
      return;
    }

    const content: PostContentUpload = {
      type: 'video',
      video,
      previewImage,
      description: caption.trim(),
    };

    await createPostWithContent(content, title);
  }, [caption, createPostWithContent, previewImage, title, video]);

  useImperativeHandle(ref, () => ({ submit: handlePost }), [handlePost]);

  const isPostDisabled = (wizardMode ? false : !title.trim()) || !video;

  return (
    <>
      <div className={sharedStyles.mediaWrapper}>
        {!video && (
          <div className={sharedStyles.mediaUploadSection}>
            <p className={sharedStyles.mediaUploadLabel}>Upload Video</p>
            <DragDropZone
              onFilesSelected={handleVideoUpload}
              accept="video/*"
              multiple={false}
              disabled={false}
            />
          </div>
        )}

        {video && (
          <div className={sharedStyles.mediaPreviewContainer}>
            <div className={styles.videoPreview}>
              <video src={video} controls>
                <track kind="captions" srcLang="en" label="English captions" />
              </video>
            </div>
            <button type="button" onClick={handleRemoveVideo} className={sharedStyles.removeButton}>
              Remove Video
            </button>
          </div>
        )}

        {video && (
          <div className={styles.previewImageUploadSection}>
            <p className={styles.previewImageLabel}>Video Preview Image (optional)</p>
            {!previewImage && (
              <DragDropZone
                onFilesSelected={handlePreviewImageUpload}
                accept="image/*"
                multiple={false}
                disabled={false}
              />
            )}
            {previewImage && (
              <div className={styles.previewImagePreview}>
                <img src={previewImage} alt="Preview" />
                <button
                  type="button"
                  onClick={handleRemovePreviewImage}
                  className={sharedStyles.removeButton}
                >
                  Remove Preview Image
                </button>
              </div>
            )}
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

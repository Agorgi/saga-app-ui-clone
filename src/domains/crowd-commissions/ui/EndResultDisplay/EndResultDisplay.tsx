import { readQuillObj } from '@components/QuillEditor/readQuillObj';
import type { RichTextOps } from '@saga/crowd-commission-middleware';
import { EmblaCarousel } from '@saga/global-web';
import {
  getCrowdCommissionEndResultMediaUrl,
  mapCrowdCommissionEndResultDescriptionImageIds,
} from '@utils/getImageUrls';
import styles from './EndResultDisplay.module.scss';

interface EndResultDisplayProps {
  endResultDescription: RichTextOps | null;
  endResultMediaIds: string[] | null;
  userId: string;
  commissionId: string;
}

const CAROUSEL_OPTIONS = { loop: false };

function isVideoId(id: string): boolean {
  const lower = id.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov');
}

export function EndResultDisplay({
  endResultDescription,
  endResultMediaIds,
  userId,
  commissionId,
}: EndResultDisplayProps) {
  const hasDescription = endResultDescription?.ops.some(
    (op) =>
      (typeof op.insert === 'string' && (op.insert as string).trim().length > 0) ||
      typeof op.insert === 'object',
  );
  const hasMedia = endResultMediaIds !== null && endResultMediaIds.length > 0;

  if (!hasDescription && !hasMedia) {
    return null;
  }

  const imageIds = hasMedia ? endResultMediaIds.filter((id) => !isVideoId(id)) : [];
  const videoIds = hasMedia ? endResultMediaIds.filter((id) => isVideoId(id)) : [];

  const imageUrls = imageIds.map((id) =>
    getCrowdCommissionEndResultMediaUrl(userId, commissionId, id),
  );
  const videoUrls = videoIds.map((id) =>
    getCrowdCommissionEndResultMediaUrl(userId, commissionId, id),
  );

  const descriptionHtml =
    hasDescription && endResultDescription
      ? readQuillObj(
          {
            ...endResultDescription,
            ops: mapCrowdCommissionEndResultDescriptionImageIds(
              endResultDescription.ops,
              userId,
              commissionId,
            ),
          },
          'html',
        )
      : null;

  return (
    <div className={styles.container}>
      {imageUrls.length > 0 && (
        <div className={styles.imageCarousel}>
          <EmblaCarousel
            images={imageUrls}
            options={CAROUSEL_OPTIONS}
            showDots={imageUrls.length > 1}
          />
        </div>
      )}
      {videoUrls.map((src) => (
        <div key={src} className={styles.videoContainer}>
          <video src={src} controls preload="metadata" className={styles.video} poster="">
            <track kind="captions" srcLang="en" label="English captions" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
      {descriptionHtml && (
        <div
          className={`${styles.description} ql-snow ql-editor`}
          // readQuillObj sanitizes via DOMPurify before returning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by DOMPurify inside readQuillObj
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      )}
    </div>
  );
}

// Wireframe clone: production builds CDN image URLs from storage keys/ids (see app-web's
// @utils/getImageUrls). The clone has no CDN, so these helpers pass values through
// unchanged: fixtures supply full placeholder URLs or null, and no network request is made.
// Signatures mirror the production helpers so cloned components import them verbatim.

export function getCrowdCommissionImageUrl(
  _userId: string,
  _commissionId: string,
  fileName: string,
  _width?: number,
): string {
  return fileName;
}

export function getCrowdCommissionDescriptionImageUrl(
  _userId: string,
  _commissionId: string,
  imageId: string,
  _width?: number,
): string {
  return imageId;
}

function mapOpsImageIds(
  ops: Array<Record<string, unknown>>,
  getUrl: (imageId: string) => string,
): Array<Record<string, unknown>> {
  return ops.map((op) => {
    const insert = op.insert;
    if (!insert || typeof insert !== 'object') return op;
    const image = (insert as Record<string, unknown>).image;
    if (!image || typeof image !== 'string') return op;
    if (image.startsWith('http://') || image.startsWith('https://')) return op;
    return {
      ...op,
      insert: { ...(insert as Record<string, unknown>), image: getUrl(image) },
    };
  });
}

export function mapCrowdCommissionDescriptionImageIds(
  ops: Array<Record<string, unknown>>,
  userId: string,
  commissionId: string,
  width?: number,
): Array<Record<string, unknown>> {
  return mapOpsImageIds(ops, (imageId) =>
    getCrowdCommissionDescriptionImageUrl(userId, commissionId, imageId, width),
  );
}

export function getCrowdCommissionEndResultMediaUrl(
  _userId: string,
  _commissionId: string,
  mediaId: string,
  _width?: number,
): string {
  return mediaId;
}

export function mapCrowdCommissionEndResultDescriptionImageIds(
  ops: Array<Record<string, unknown>>,
  userId: string,
  commissionId: string,
  width?: number,
): Array<Record<string, unknown>> {
  return mapOpsImageIds(ops, (imageId) =>
    getCrowdCommissionEndResultMediaUrl(userId, commissionId, imageId, width),
  );
}

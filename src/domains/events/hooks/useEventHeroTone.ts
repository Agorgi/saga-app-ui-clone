import { useEffect, useState } from 'react';

export type EventHeroTone = 'light' | 'dark';

const LUMINANCE_THRESHOLD = 0.52;
const SAMPLE_SIZE = 32;

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function averageLuminanceFromImageData(data: Uint8ClampedArray): number {
  const pixelCount = data.length / 4;
  if (pixelCount === 0) {
    return 0;
  }

  let luminanceSum = 0;
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index] ?? 0;
    const green = data[index + 1] ?? 0;
    const blue = data[index + 2] ?? 0;
    luminanceSum += relativeLuminance(red, green, blue);
  }

  return luminanceSum / pixelCount;
}

function toneFromBannerUrl(bannerUrl: string): Promise<EventHeroTone> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          resolve('dark');
          return;
        }

        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const averageLuminance = averageLuminanceFromImageData(data);
        resolve(averageLuminance >= LUMINANCE_THRESHOLD ? 'light' : 'dark');
      } catch {
        resolve('dark');
      }
    };

    image.onerror = () => {
      resolve('dark');
    };

    image.src = bannerUrl;
  });
}

function toneFromAppTheme(appTheme: string): EventHeroTone {
  return appTheme === 'light' ? 'light' : 'dark';
}

// Wireframe clone: copied from the source. Picks light vs dark hero text from
// banner luminance, falling back to app theme. The clone has no real banners, so
// bannerUrl is always undefined and this resolves to the theme fallback.
export function useEventHeroTone(
  bannerUrl: string | undefined,
  appTheme: string = 'dark',
): EventHeroTone {
  const fallbackTone = toneFromAppTheme(appTheme);
  const [tone, setTone] = useState<EventHeroTone>(fallbackTone);

  useEffect(() => {
    if (!bannerUrl) {
      setTone(fallbackTone);
      return undefined;
    }

    const state = { cancelled: false };

    toneFromBannerUrl(bannerUrl).then((nextTone) => {
      if (!state.cancelled) {
        setTone(nextTone);
      }
    });

    return () => {
      state.cancelled = true;
    };
  }, [bannerUrl, fallbackTone]);

  return tone;
}

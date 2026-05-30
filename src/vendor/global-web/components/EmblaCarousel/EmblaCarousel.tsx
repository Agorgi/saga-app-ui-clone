import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import type React from 'react';
import { Children, memo, useEffect } from 'react';
import { useTrackEvent } from '../../amplitude';
import { ImageWithSpinner } from '../ImageWithSpinner/ImageWithSpinner';
import './Embla.scss';
import { NextButton, PrevButton } from './EmblaCarouselArrowButtons';
import { DotButton } from './EmblaCarouselDotButton';
import { useDotButton } from './useDotButton';
import { usePrevNextButtons } from './usePrevNextButtons';

export type EmblaCarouselProps = {
  slides?: number[];
  images?: string[];
  children?: React.ReactNode[];
  options?: EmblaOptionsType;
  showControls?: boolean;
  showDots?: boolean;
  className?: string;
  classNames?: {
    viewport?: string;
    container?: string;
    slide?: string;
    controls?: string;
    buttons?: string;
    button?: string;
    buttonSvg?: string;
    dots?: string;
    dot?: string;
  };
  onSlideChange?: (index: number) => void;
};

export const EmblaCarousel: React.FC<EmblaCarouselProps> = memo(
  ({
    slides,
    images,
    children,
    options,
    showControls = true,
    showDots = true,
    className,
    classNames,
    onSlideChange,
  }) => {
    const slideCount = images?.length || children?.length || slides?.length || 0;
    const carouselOptions = slideCount <= 1 ? { ...options, active: false } : options;
    const { trackEvent } = useTrackEvent();
    const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);

    const handleImageContextMenu = (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
    };

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
      usePrevNextButtons(emblaApi);

    useEffect(() => {
      if (!emblaApi || !onSlideChange) return;

      const handleSelect = () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        onSlideChange(currentIndex);
      };

      emblaApi.on('select', handleSelect);
      handleSelect();

      return () => {
        emblaApi.off('select', handleSelect);
      };
    }, [emblaApi, onSlideChange]);

    // Determine what to render
    const renderSlides = () => {
      const slideClassName = classNames?.slide
        ? `embla__slide ${classNames.slide}`
        : 'embla__slide';

      if (images && images.length > 0) {
        return images.map((img, index) => (
          <div className={slideClassName} key={index}>
            <div className="embla__slide__img-wrapper">
              <ImageWithSpinner
                src={img}
                alt={`Slide ${index + 1}`}
                className="embla__slide__img"
                onContextMenu={handleImageContextMenu}
                draggable={false}
              />
            </div>
          </div>
        ));
      }
      if (children && children.length > 0) {
        let childKeyCounter = 0;
        return Children.map(children, (child) => (
          <div className={slideClassName} key={`child-${childKeyCounter++}`}>
            {child}
          </div>
        ));
      }
      if (slides && slides.length > 0) {
        return slides.map((index: number) => (
          <div className={slideClassName} key={index}>
            <div className="embla__slide__number">{index + 1}</div>
          </div>
        ));
      }
      return null;
    };

    const viewportClassName = classNames?.viewport
      ? `embla__viewport ${classNames.viewport}`
      : 'embla__viewport';
    const containerClassName = classNames?.container
      ? `embla__container ${classNames.container}`
      : 'embla__container';
    const controlsClassName = classNames?.controls
      ? `embla__controls ${classNames.controls}`
      : 'embla__controls';
    const buttonsClassName = classNames?.buttons
      ? `embla__buttons ${classNames.buttons}`
      : 'embla__buttons';
    const dotsClassName = classNames?.dots ? `embla__dots ${classNames.dots}` : 'embla__dots';

    return (
      <section className={`embla ${className || ''}`}>
        <div className={viewportClassName} ref={emblaRef}>
          <div className={containerClassName}>{renderSlides()}</div>
        </div>

        {slideCount > 1 && (showControls || showDots) && (
          <div className={controlsClassName}>
            {showControls && (
              <div className={buttonsClassName}>
                <PrevButton
                  onClick={() => {
                    trackEvent('image_carousel_prev_button_click', '');
                    onPrevButtonClick();
                  }}
                  disabled={prevBtnDisabled}
                  className={classNames?.button}
                  svgClassName={classNames?.buttonSvg}
                />
                <NextButton
                  onClick={() => {
                    trackEvent('image_carousel_next_button_click', '');
                    onNextButtonClick();
                  }}
                  disabled={nextBtnDisabled}
                  className={classNames?.button}
                  svgClassName={classNames?.buttonSvg}
                />
              </div>
            )}

            {showDots && (
              <div className={dotsClassName}>
                {scrollSnaps.map((snap, index: number) => {
                  const isSelected = index === selectedIndex;
                  const baseDotClass = isSelected
                    ? 'embla__dot embla__dot--selected'
                    : 'embla__dot';
                  const dotClassName = classNames?.dot
                    ? `${baseDotClass} ${classNames.dot}`
                    : baseDotClass;

                  return (
                    <DotButton
                      key={snap}
                      onClick={() => {
                        trackEvent('image_carousel_dot_button_click', '');
                        onDotButtonClick(index);
                      }}
                      className={dotClassName}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    );
  },
);

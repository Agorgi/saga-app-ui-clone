import type { JSX } from 'react';
import React, { useMemo } from 'react';
import styles from './Linkify.module.scss';
import { extractLinkMatches, parseLinkMatch } from './linkUtils';

export type LinkifyTextProps = {
  text?: string | null;
  className?: string;
  linkClassName?: string;
  /** Tag to render (defaults to `p`) — `as` compatibility prop removed */
  tagName?: 'p' | 'div' | 'span';
};

export const LinkifyText: React.FC<LinkifyTextProps> = React.memo(
  ({ text, className, linkClassName, tagName = 'p' }) => {
    const Tag = tagName as keyof JSX.IntrinsicElements;

    const nodes = useMemo(() => {
      if (!text) return [] as Array<string | JSX.Element>;

      // Fast-path: skip expensive regex when input contains no link-like markers
      const hasLinkIndicators =
        text.indexOf('@') !== -1 ||
        text.indexOf('http') !== -1 ||
        text.indexOf('www.') !== -1 ||
        text.indexOf('.') !== -1;
      if (!hasLinkIndicators) return [text];

      const parts: Array<string | JSX.Element> = [];
      let lastIndex = 0;

      for (const m of extractLinkMatches(text)) {
        const matchText = m.match;
        const index = m.index;

        if (index > lastIndex) parts.push(text.slice(lastIndex, index));

        const { core, href, trailing } = parseLinkMatch(matchText);

        if (core && href) {
          parts.push(
            <a
              key={`${index}-${core}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName ?? styles.link}
            >
              {core}
            </a>,
          );
        } else {
          // Fallback: preserve token as plain text when it's not a safe/valid link
          parts.push(matchText);
        }

        if (trailing) parts.push(trailing);
        lastIndex = index + matchText.length;
      }

      if (lastIndex < text.length) parts.push(text.slice(lastIndex));
      return parts;
    }, [text, linkClassName]);

    if (nodes.length === 0) return null;
    return <Tag className={className ?? styles.container}>{nodes}</Tag>;
  },
);

LinkifyText.displayName = 'LinkifyText';

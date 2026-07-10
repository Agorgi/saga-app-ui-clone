import { ChevronDown } from '@untitledui/icons';
import { useCallback, useState } from 'react';
import styles from './EventFAQSection.module.scss';

export interface FAQItem {
  question: string;
  answer: string;
}

interface EventFAQSectionProps {
  faqs?: FAQItem[];
}

interface FAQItemRowProps {
  readonly item: FAQItem;
  readonly index: number;
  readonly isExpanded: boolean;
  readonly isLast: boolean;
  readonly onToggle: (index: number) => void;
}

function FAQItemRow({ item, index, isExpanded, isLast, onToggle }: FAQItemRowProps) {
  const handleClick = useCallback(() => onToggle(index), [onToggle, index]);

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.question}
        onClick={handleClick}
        aria-expanded={isExpanded}
      >
        <span className={styles.questionText}>{item.question}</span>
        <ChevronDown
          className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
          width={20}
          height={20}
        />
      </button>
      {isExpanded ? (
        <div className={styles.answer}>
          <p className={styles.answerText}>{item.answer}</p>
        </div>
      ) : null}
      {!isLast && <div className={styles.divider} />}
    </div>
  );
}

// Wireframe clone: copied near-verbatim from the source (local FAQItem type
// instead of the middleware one). Fixture-backed, expand/collapse is local state.
export function EventFAQSection({ faqs }: EventFAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  }, []);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>FAQ</h2>
      <div className={styles.list}>
        {faqs.map((item, index) => (
          <FAQItemRow
            key={item.question}
            item={item}
            index={index}
            isExpanded={expandedIndex === index}
            isLast={index === faqs.length - 1}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

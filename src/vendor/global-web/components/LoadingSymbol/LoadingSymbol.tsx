import { cx } from '../../utils/cx';
import styles from './LoadingSymbol.module.scss';

type LoadingSymbolSize = 'small' | 'medium' | 'large';

interface LoadingSymbolProps {
  size?: LoadingSymbolSize;
}

export const LoadingSymbol = ({ size = 'medium' }: LoadingSymbolProps) => {
  return (
    <div className={cx(styles.container, styles[`container-${size}` as keyof typeof styles])}>
      <div className={cx(styles.spinner, styles[`spinner-${size}` as keyof typeof styles])}></div>
    </div>
  );
};

import { Moon01, Sun } from '@untitledui/icons';
import { useTheme } from '../ThemeProvider/useTheme';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={styles.iconWrapper}>
        {theme === 'dark' ? <Moon01 className={styles.icon} /> : <Sun className={styles.icon} />}
      </div>
    </button>
  );
}

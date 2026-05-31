import { Card, Icon, Loader, Stack } from '@saga/global-web';
import styles from './ProfileState.module.scss';

type ProfileStateProps = {
  isLoading?: boolean;
  error?: string;
  isEmpty?: boolean;
  loadingMessage?: string;
  errorTitle?: string;
  emptyMessage?: string;
};

export function ProfileState({
  isLoading = false,
  error,
  isEmpty = false,
  loadingMessage = 'Loading profile...',
  errorTitle = 'Error loading profile:',
  emptyMessage = 'No profile found.',
}: ProfileStateProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Card className="precedent-w-full precedent-max-w-screen-md precedent-flex-grow">
          <Stack className="precedent-gap-sm precedent-items-center">
            <Loader />
            <h2>{loadingMessage}</h2>
          </Stack>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Card className="precedent-w-full precedent-max-w-screen-md precedent-flex-grow">
          <Stack className="precedent-gap-sm precedent-items-center">
            <Icon name="MdError" size="2rem" />
            <h2>{errorTitle}</h2>
            <p>{error}</p>
          </Stack>
        </Card>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.container}>
        <Card className="precedent-w-full precedent-max-w-screen-md precedent-flex-grow">
          <Stack className="precedent-gap-sm precedent-items-center">
            <h2>{emptyMessage}</h2>
          </Stack>
        </Card>
      </div>
    );
  }

  return null;
}

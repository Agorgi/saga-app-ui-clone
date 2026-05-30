import { assertNever } from '@saga/precedent-middleware';
import { AlertCircle, AlertTriangle, CheckCircle, InfoCircle, XClose } from '@untitledui/icons';
import type { ReactNode } from 'react';
import type { CloseButtonProps, IconProps, ToastIcon } from 'react-toastify';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../ThemeProvider/useTheme';
import './Toast.scss';

function renderToastIcon(props: IconProps): ReactNode {
  if (props.isLoading) {
    return <div className="toast-loading-spinner" role="status" aria-label="Loading" />;
  }

  switch (props.type) {
    case 'success':
      return <CheckCircle className="toast-icon toast-icon--success" aria-hidden />;
    case 'error':
      return <AlertCircle className="toast-icon toast-icon--error" aria-hidden />;
    case 'warning':
      return <AlertTriangle className="toast-icon toast-icon--warning" aria-hidden />;
    case 'info':
      return <InfoCircle className="toast-icon toast-icon--info" aria-hidden />;
    case 'default':
      return <InfoCircle className="toast-icon toast-icon--default" aria-hidden />;
    default:
      return assertNever(props.type);
  }
}

const toastIconRenderer: ToastIcon = (props) => renderToastIcon(props);

function ToastCloseButton(props: CloseButtonProps): ReactNode {
  return (
    <button
      type="button"
      className="toast-close-btn"
      onClick={props.closeToast}
      aria-label={props.ariaLabel ?? 'Dismiss notification'}
    >
      <XClose className="toast-close-btn__icon" aria-hidden />
    </button>
  );
}

export function Toast(): ReactNode {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-center"
      transition={Slide}
      hideProgressBar
      newestOnTop={false}
      theme={theme}
      autoClose={3000}
      className="ToastContainer"
      toastClassName="SagaToast"
      icon={toastIconRenderer}
      closeButton={ToastCloseButton}
      pauseOnHover
      pauseOnFocusLoss
    />
  );
}

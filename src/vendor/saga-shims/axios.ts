// Wireframe shim for axios — type only.
// errorTypes.ts imports the AxiosError type for a runtime type guard. The UI
// clone never makes HTTP calls, so we reproduce just the minimal shape the
// guard inspects instead of pulling in the real dependency.

export interface AxiosError<T = unknown> {
  isAxiosError: boolean;
  message: string;
  response?: {
    status?: number;
    data?: T;
  };
}

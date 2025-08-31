export const withPath = (message: string, error: Error): string => {
  const err = error as any;
  return err?.path ? `${message}: "${err.path}"` : message;
};
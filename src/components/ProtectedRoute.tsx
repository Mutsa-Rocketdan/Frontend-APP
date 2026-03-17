// TODO: 백엔드 연결 후 아래 임시 우회 제거하고 원래 인증 로직 복원
import type { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

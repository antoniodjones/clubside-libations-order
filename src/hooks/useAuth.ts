import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const useAuth = () => {
  const { user, session, loading, clearAuthState, setAuthState } = useAuthState();
  const authActions = useAuthActions(setAuthState, clearAuthState);

  return {
    user,
    session,
    loading,
    ...authActions,
  };
};
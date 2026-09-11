const mockUser = {
  id: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@example.com',
};

export const useUser = () => {
  return {
    data: mockUser,
    isLoading: false,
    isError: false,
    error: null,
  };
};

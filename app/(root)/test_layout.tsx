import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
// import { getUserData } from '@/app/(root)/api';
import Layout from '@/app/(root)/layout';
import { getUserByID } from '@/firebase/db';

jest.mock('next/router');
jest.mock('@/app/(root)/api');

describe('Layout', () => {
  it('redirects to user page if user data matches', async () => {
    const mockUser = { uid: '123' };
    const mockUserData = { userID: '123' };
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (getUserData as jest.Mock).mockResolvedValue(mockUserData);

    render(<Layout user={mockUser} />);

    await waitFor(() => expect(getUserByID).toHaveBeenCalledTimes(1));

    expect(mockRouterPush).toHaveBeenCalledWith(`/${mockUserData.userID}`);
  });

  it('sets user data fetched to true if user data does not match', async () => {
    const mockUser = { uid: '123' };
    const mockUserData = { userID: '456' };
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (getUserData as jest.Mock).mockResolvedValue(mockUserData);

    render(<Layout user={mockUser} />);

    await waitFor(() => expect(getUserData).toHaveBeenCalledTimes(1));

    expect(screen.queryByText('User data fetched(Setup):')).not.toBeInTheDocument();
  });
});
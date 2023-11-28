// import SignInScreen from '@/app/(auth)/login/page';
// import {render, screen} from '@testing-library/react';


// it('renders the sign in screen', () => {
//     render(<SignInScreen />); // Arrange

//     // Action
//     const login_para = screen.getByText('Please Sign In or Sign Up using your Email or Gmail.');
//     // const login_button = screen.getByText('Sign in with Google');

//     // Assert
//     expect(login_para).toBeInTheDocument();


// });

import SignInScreen from '@/app/(auth)/login/page';
import { render, screen } from '@testing-library/react';

// initialize firebase 
jest.mock('../firebase/firebaseApp.ts', () => ({
  auth: jest.fn(() => ({
    currentUser: null,
  })),
}));


jest.mock('../hooks/AuthProvider.tsx', () => ({
  useAuthProvider: jest.fn(() => ({
    user: null,
    loading: false,
    error: null,
  })),
}));

describe('SignInScreen', () => {
  it('renders the loading state', () => {
    // Arrange
    const { container } = render(<SignInScreen />);

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    // Arrange
    jest.mock('../hooks/AuthProvider.tsx', () => ({
      useAuthProvider: jest.fn(() => ({
        user: null,
        loading: false,
        error: { message: 'Something went wrong' },
      })),
    }));

    // Act
    const { container } = render(<SignInScreen />);

    // Assert
    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

//   it('renders the sign in state', () => {
//     // Arrange
//     jest.mock('@/app/(auth)/useAuthProvider', () => ({
//       useAuthProvider: jest.fn(() => ({
//         user: null,
//         loading: false,
//         error: null,
//       })),
//     }));

//     // Act
//     const { container } = render(<SignInScreen />);

//     // Assert
//     expect(screen.getByText('Please Sign In or Sign Up using your Email or Gmail.')).toBeInTheDocument();
//     expect(container.querySelector('.flex')).toBeInTheDocument();
//   });

//   it('renders the user state', () => {
//     // Arrange
//     jest.mock('@/app/hooks/AuthProvider', () => ({
//       useAuthProvider: jest.fn(() => ({
//         user: {
//           displayName: 'John Doe',
//           uid: '123',
//           email: 'john.doe@example.com',
//         },
//         loading: false,
//         error: null,
//       })),
//     }));

//     // Act
//     const { container } = render(<SignInScreen />);

//     // Assert
//     expect(screen.getByText('Welcome John Doe! You are now signed-in!')).toBeInTheDocument();
//     expect(screen.getByText('userID: 123')).toBeInTheDocument();
//     expect(screen.getByText('email: john.doe@example.com')).toBeInTheDocument();
//     expect(screen.getByText('Sign-out')).toBeInTheDocument();
//     expect(container.querySelector('.flex')).toBeInTheDocument();
//   });
});
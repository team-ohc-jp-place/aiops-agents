import '@testing-library/jest-dom';
import { vi } from 'vitest';
import fetch from 'cross-fetch';

// Set up fetch polyfill
global.fetch = fetch;

// Mock SWR hooks
vi.mock('swr', () => ({
  default: vi.fn(),
  mutate: vi.fn(),
}));

// Mock zustand store
vi.mock('@/hooks/use-cart', () => ({
  useCart: vi.fn(() => ({
    items: [],
    total: 0,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  })),
}));

// Mock user hook
vi.mock('@/hooks/use-user', () => ({
  useUser: vi.fn(() => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Mock router
vi.mock('wouter', () => ({
  Link: vi.fn(({ children, ...props }) => (
    <span data-testid="mock-link" {...props}>
      {children}
    </span>
  )),
  useLocation: vi.fn(() => ["/", vi.fn()]),
}));

// Set up global test utilities
beforeAll(() => {
  vi.mock('@testing-library/react', async () => {
    const actual = await vi.importActual('@testing-library/react');
    return {
      ...actual,
      render: (ui: React.ReactElement) => ({
        ...actual.render(ui),
      }),
    };
  });
});

beforeEach(() => {
  vi.clearAllMocks();
});

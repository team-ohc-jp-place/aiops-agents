import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PetCard } from './PetCard';
import { useCart } from '@/hooks/use-cart';

vi.mock('@/hooks/use-cart');

describe('PetCard', () => {
  const mockPet = {
    id: 1,
    name: 'Test Pet',
    species: 'Dog',
    breed: 'Test Breed',
    age: 2,
    price: '100.00',
    description: 'Test description',
    imageUrl: 'test-image.jpg',
    stock: 5,
    createdAt: new Date().toISOString(),
  };

  it('renders pet information correctly', () => {
    render(<PetCard pet={mockPet} />);
    
    expect(screen.getByText('Test Pet')).toBeInTheDocument();
    expect(screen.getByText('Test Breed')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('calls addToCart when add to cart button is clicked', () => {
    const mockAddToCart = vi.fn();
    (useCart as any).mockReturnValue({ addToCart: mockAddToCart });

    render(<PetCard pet={mockPet} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockPet);
  });
});

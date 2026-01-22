import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('should render a div element', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').tagName).toBe('DIV');
  });

  it('should have default animation class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
  });

  it('should have rounded-lg class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
  });

  it('should have bg-secondary class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('bg-secondary');
  });

  it('should merge custom className', () => {
    render(<Skeleton data-testid="skeleton" className="w-full h-10" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('w-full');
    expect(skeleton).toHaveClass('h-10');
  });

  it('should pass additional props', () => {
    render(<Skeleton data-testid="skeleton" aria-label="Loading" />);

    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-label', 'Loading');
  });

  it('should render with inline styles', () => {
    render(<Skeleton data-testid="skeleton" style={{ width: '200px', height: '100px' }} />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });
});

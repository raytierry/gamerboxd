import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('should render a div element', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton').tagName).toBe('DIV');
  });

  it('should have default shimmer animation class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('animate-shimmer');
  });

  it('should have rounded-lg class', () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg');
  });

  it('should have pulse animation when variant is pulse', () => {
    render(<Skeleton data-testid="skeleton" variant="pulse" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    expect(screen.getByTestId('skeleton')).toHaveClass('from-secondary');
  });

  it('should merge custom className', () => {
    render(<Skeleton data-testid="skeleton" className="w-full h-10" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-shimmer');
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

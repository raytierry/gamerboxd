import { render, screen } from '@testing-library/react';
import PageWrapper from '@/components/PageWrapper/PageWrapper';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => false,
}));

describe('PageWrapper', () => {
  it('should render children', () => {
    render(
      <PageWrapper>
        <div data-testid="child">Child content</div>
      </PageWrapper>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should apply className when provided', () => {
    render(
      <PageWrapper className="custom-class">
        <span>Content</span>
      </PageWrapper>
    );

    expect(screen.getByTestId('motion-div')).toHaveClass('custom-class');
  });

  it('should work without className', () => {
    render(
      <PageWrapper>
        <span>Content</span>
      </PageWrapper>
    );

    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
    expect(motionDiv.className).toBe('');
  });

  it('should render multiple children', () => {
    render(
      <PageWrapper>
        <div data-testid="child-1">First</div>
        <div data-testid="child-2">Second</div>
      </PageWrapper>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});

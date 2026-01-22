import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not trigger click when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply default variant styles', () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should apply destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'destructive');
  });

  it('should apply outline variant', () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'outline');
  });

  it('should apply ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'ghost');
  });

  it('should apply default size', () => {
    render(<Button>Default Size</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should apply small size', () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'sm');
  });

  it('should apply large size', () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('should apply icon size', () => {
    render(<Button size="icon">🎮</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'icon');
  });

  it('should merge custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render as child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should pass additional props to button', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );

    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

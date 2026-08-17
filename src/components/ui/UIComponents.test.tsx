import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import Chip from './Chip';
import Metric from './Metric';
import SaveControl from './SaveControl';

describe('Common UI Primitives', () => {
  test('Button variant와 size를 지원하고 클릭을 처리한다', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        길찾기
      </Button>,
    );
    const button = screen.getByRole('button', { name: '길찾기' });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('Chip selected 상태와 aria-pressed 속성을 지원한다', () => {
    const { rerender } = render(<Chip selected={false}>야간안심</Chip>);
    const chip = screen.getByRole('button', { name: '야간안심' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    rerender(<Chip selected={true}>야간안심</Chip>);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  test('Metric 레이블, 값, 단위를 올바르게 렌더링한다', () => {
    render(<Metric label="거리" value="5.2" unit="km" />);
    expect(screen.getByText('거리')).toBeInTheDocument();
    expect(screen.getByText('5.2')).toBeInTheDocument();
    expect(screen.getByText('km')).toBeInTheDocument();
  });

  test('SaveControl의 저장 상태에 따라 accessible name과 aria-pressed가 변경된다', () => {
    const handleToggle = vi.fn();
    const { rerender } = render(
      <SaveControl saved={false} onToggle={handleToggle} />,
    );
    const saveButton = screen.getByRole('button', { name: '코스 저장' });
    expect(saveButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(saveButton);
    expect(handleToggle).toHaveBeenCalledTimes(1);

    rerender(<SaveControl saved={true} onToggle={handleToggle} />);
    const unsaveButton = screen.getByRole('button', { name: '코스 저장 해제' });
    expect(unsaveButton).toHaveAttribute('aria-pressed', 'true');
  });
});

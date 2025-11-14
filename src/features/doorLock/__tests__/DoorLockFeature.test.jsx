import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoorLockFeature } from '../DoorLockFeature';
import { DOOR_LOCK_CONFIG } from '../config';

/**
 * Integration tests for DoorLockFeature component
 * 
 * Tests the complete user flow:
 * - Initial locked state
 * - PIN entry via numeric keypad
 * - Error handling
 * - Successful unlock
 * - Locking again
 */

describe('DoorLockFeature', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render in locked state initially', () => {
    render(<DoorLockFeature />);
    
    expect(screen.getByText(/PIN de Seguridad/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /door closed/i })).toBeInTheDocument();
    expect(screen.getByText(/LOCKED/i)).toBeInTheDocument();
  });

  it('should show numeric keypad buttons', () => {
    render(<DoorLockFeature />);
    
    // Check for all numeric buttons 0-9
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `Number ${i}` })).toBeInTheDocument();
    }
    
    // Check for clear button
    expect(screen.getByRole('button', { name: /Borrar/i })).toBeInTheDocument();
  });

  it('should show error on incorrect PIN', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Click wrong PIN: 1234
    await user.click(screen.getByRole('button', { name: 'Number 1' }));
    await user.click(screen.getByRole('button', { name: 'Number 2' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Number 4' }));
    
    await waitFor(() => {
      expect(screen.getByText(/PIN Incorrecto/i)).toBeInTheDocument();
    });
  });

  it('should unlock with correct PIN', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Click correct PIN: 8766
    await user.click(screen.getByRole('button', { name: 'Number 8' }));
    await user.click(screen.getByRole('button', { name: 'Number 7' }));
    await user.click(screen.getByRole('button', { name: 'Number 6' }));
    await user.click(screen.getByRole('button', { name: 'Number 6' }));
    
    await waitFor(() => {
      expect(screen.getByText(/access granted/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('img', { name: /door open/i })).toBeInTheDocument();
  });

  it('should lock door again after unlocking', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Unlock with correct PIN: 8766
    await user.click(screen.getByRole('button', { name: 'Number 8' }));
    await user.click(screen.getByRole('button', { name: 'Number 7' }));
    await user.click(screen.getByRole('button', { name: 'Number 6' }));
    await user.click(screen.getByRole('button', { name: 'Number 6' }));
    
    await waitFor(() => {
      expect(screen.getByText(/access granted/i)).toBeInTheDocument();
    });
    
    // Lock again
    const lockButton = screen.getByRole('button', { name: /lock door again/i });
    await user.click(lockButton);
    
    await waitFor(() => {
      expect(screen.getByText(/PIN de Seguridad/i)).toBeInTheDocument();
      expect(screen.getByText(/LOCKED/i)).toBeInTheDocument();
    });
  });

  it('should support keyboard numeric input', async () => {
    render(<DoorLockFeature />);
    
    // Simulate keyboard numeric input: 8766
    fireEvent.keyDown(window, { key: '8' });
    fireEvent.keyDown(window, { key: '7' });
    fireEvent.keyDown(window, { key: '6' });
    fireEvent.keyDown(window, { key: '6' });
    
    await waitFor(() => {
      expect(screen.getByText(/access granted/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show lockout after max failed attempts', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Make max failed attempts with wrong PIN: 1234
    for (let i = 0; i < DOOR_LOCK_CONFIG.maxAttempts; i++) {
      await user.click(screen.getByRole('button', { name: 'Number 1' }));
      await user.click(screen.getByRole('button', { name: 'Number 2' }));
      await user.click(screen.getByRole('button', { name: 'Number 3' }));
      await user.click(screen.getByRole('button', { name: 'Number 4' }));
      // Wait a bit for animation
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    
    await waitFor(() => {
      expect(screen.getByText(/BLOQUEADO/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: 'Number 1' })).toBeDisabled();
  });

  it('should have accessible keypad controls', () => {
    render(<DoorLockFeature />);
    
    // Check numeric buttons have proper ARIA labels
    const button0 = screen.getByRole('button', { name: 'Number 0' });
    const button9 = screen.getByRole('button', { name: 'Number 9' });
    const clearButton = screen.getByRole('button', { name: /Borrar/i });
    
    expect(button0).toBeInTheDocument();
    expect(button9).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute('aria-label', 'Borrar PIN');
  });

  it('should show remaining attempts after failed attempt', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Enter wrong PIN: 1234
    await user.click(screen.getByRole('button', { name: 'Number 1' }));
    await user.click(screen.getByRole('button', { name: 'Number 2' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Number 4' }));
    
    await waitFor(() => {
      expect(screen.getByText(/4 intento/i)).toBeInTheDocument();
    });
  });

  it('should display PIN dots as digits are entered', async () => {
    const user = userEvent.setup();
    render(<DoorLockFeature />);
    
    // Initially all dots should be empty
    const pinDisplay = screen.getByLabelText(/PIN display/i);
    expect(pinDisplay).toBeInTheDocument();
    
    // Click first digit
    await user.click(screen.getByRole('button', { name: 'Number 8' }));
    
    // Should show one filled dot
    await waitFor(() => {
      expect(pinDisplay.textContent).toContain('●');
    });
  });
});

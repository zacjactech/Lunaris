import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmotionForm from '../EmotionForm';
import axiosInstance from '@/lib/axios';

jest.mock('@/lib/axios');

describe('EmotionForm', () => {
  const mockOnEntryCreated = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders emotion buttons and note textarea', () => {
    render(<EmotionForm onEntryCreated={mockOnEntryCreated} />);
    
    expect(screen.getByText(/peaceful/i)).toBeInTheDocument();
    expect(screen.getByText(/grateful/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/how are you feeling/i)).toBeInTheDocument();
  });

  it('selects emotion on button click', () => {
    render(<EmotionForm onEntryCreated={mockOnEntryCreated} />);
    
    const peacefulButton = screen.getByText(/peaceful/i);
    fireEvent.click(peacefulButton);
    
    expect(peacefulButton).toHaveClass('bg-gradient-to-br');
  });

  it('disables submit button when fields are empty', () => {
    render(<EmotionForm onEntryCreated={mockOnEntryCreated} />);
    
    const submitButton = screen.getByRole('button', { name: /save reflection/i });
    
    expect(submitButton).toBeDisabled();
  });

  it('submits form with valid data', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: {} });
    render(<EmotionForm onEntryCreated={mockOnEntryCreated} />);
    
    const peacefulButton = screen.getByText(/peaceful/i);
    const noteInput = screen.getByPlaceholderText(/how are you feeling/i);
    const submitButton = screen.getByRole('button', { name: /save reflection/i });

    fireEvent.click(peacefulButton);
    fireEvent.change(noteInput, { target: { value: 'Feeling great today!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/entries', {
        emotion: 'Peaceful',
        note: 'Feeling great today!',
      });
      expect(mockOnEntryCreated).toHaveBeenCalled();
    });
  });
});

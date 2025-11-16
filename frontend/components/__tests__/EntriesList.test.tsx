import { render, screen } from '@testing-library/react';
import EntriesList from '../EntriesList';

describe('EntriesList', () => {
  const mockEntries = [
    {
      id: '1',
      emotion: 'Peaceful',
      note: 'Had a great meditation session today.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      emotion: 'Grateful',
      note: 'Thankful for my family and friends.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  it('shows loading spinner when loading', () => {
    const { container } = render(<EntriesList entries={[]} isLoading={true} />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    render(<EntriesList entries={[]} isLoading={false} />);
    
    expect(screen.getByText(/no entries yet/i)).toBeInTheDocument();
  });

  it('renders entries with emotion badges', () => {
    render(<EntriesList entries={mockEntries} isLoading={false} />);
    
    expect(screen.getByText('Peaceful')).toBeInTheDocument();
    expect(screen.getByText('Grateful')).toBeInTheDocument();
    expect(screen.getByText(/had a great meditation session/i)).toBeInTheDocument();
    expect(screen.getByText(/thankful for my family/i)).toBeInTheDocument();
  });

  it('shows relative timestamps', () => {
    render(<EntriesList entries={mockEntries} isLoading={false} />);
    
    const timestamps = screen.getAllByText(/ago/i);
    expect(timestamps.length).toBeGreaterThan(0);
  });
});

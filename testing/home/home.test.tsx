import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Index from '../../app/(tabs)/index';

jest.setTimeout(15000);
//Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [
          {
            type_id: 1,
            shape_id: 1,
            button_config: {
              text: 'Test Button',
              sub_text: 'Click me',
              icon: 'home',
              link: '/test',
              background_color: '#000000',
              background_gradient: null,
              background_image: { image_link: null },
            },
            page: { page_name: 'home' },
          },
        ],
        error: null,
      }),
    })),
  },
}));

jest.mock('../../components/home/Image_slider', () => () => <></>);
jest.mock('../../components/universal/contacts-icons', () => () => <></>);
jest.mock('../../components/home/resources', () => () => <></>);

describe('Home Page Dynamic Content', () => {
  it('renders a dynamic button from Supabase', async () => {
    const { getByText } = render(<Index />);
    
    await waitFor(() => {
      expect(getByText('Test Button')).toBeTruthy();
    });
  });
});

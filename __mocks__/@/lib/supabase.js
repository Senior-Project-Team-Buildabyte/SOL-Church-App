export const supabase = {
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
            icon: '🔥',
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
};

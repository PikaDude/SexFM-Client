import type { Config } from 'tailwindcss';

export default {
    content: [],
    theme: {
        extend: {
            backgroundImage: () => ({
                sexfm: `linear-gradient(0deg, rgba(80, 220, 255, 1) 0%, rgba(20, 167, 255, 1) 14%, rgba(0, 115, 233, 1) 45%, rgba(0, 151, 242, 1) 51%, rgba(122, 245, 255, 1) 67%, rgba(0, 204, 255, 1) 100%)`,
                sex: 'url(/sexbackground.webp)',
            }),
            colors: {
                sexfm: {
                    300: '#00CCFF',
                    400: '#33CCFF',
                    500: '#0066FF',
                    600: '#000099',
                },
            },
            fontFamily: {
                sans: ['Jersey10', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
            dropShadow: {
                sex: '0 8px 8px rgba(0, 0, 0, 0.5)',
            },
            screens: {
                xs: '400px',
            },
        },
    },
    plugins: [],
} satisfies Config;

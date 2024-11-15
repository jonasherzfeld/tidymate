/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,svelte,js,ts}'],
    theme: {
        extend: {}
    },
    plugins: [
        require('daisyui'),
        require('tailwindcss/plugin')(({ addVariant }) => {
            addVariant('search-cancel', '&::-webkit-search-cancel-button');
        })
    ],
    daisyui: {
        themes: [
            'light',
            'dark',
            {
                default: {
                    primary: '#38bdf8',
                    secondary: '#facc15',
                    accent: '#c084fc',
                    neutral: '#d6d3d1',
                    'base-100': '#78716c',
                    info: '#38bdf8',
                    success: '#34d399',
                    warning: '#fdba74',
                    error: '#f87171'
                }
            }
        ]
    }
};

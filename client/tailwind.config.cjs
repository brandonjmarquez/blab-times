/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				custom: {
          100: ({ opacityVariable, opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--color-custom-100), ${opacityValue})`;
            }

            if(opacityVariable !== undefined) {
              return `rgba(var(--color-custom-100), var(${opacityValue}, 1))`;
            }
            
            return `rgb(var(--color-custom-100))`;
          },
          200: ({ opacityVariable, opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--color-custom-200), ${opacityValue})`;
            }

            if(opacityVariable !== undefined) {
              return `rgba(var(--color-custom-200), var(${opacityValue}, 1))`;
            }
            
            return `rgb(var(--color-custom-200))`;
          },
          300: ({ opacityVariable, opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--color-custom-300), ${opacityValue})`;
            }

            if(opacityVariable !== undefined) {
              return `rgba(var(--color-custom-300), var(${opacityValue}, 1))`;
            }
            
            return `rgb(var(--color-custom-300))`;
          },
          400: ({ opacityVariable, opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--color-custom-400), ${opacityValue})`;
            }

            if(opacityVariable !== undefined) {
              return `rgba(var(--color-custom-400), var(${opacityValue}, 1))`;
            }
            
            return `rgb(var(--color-custom-400))`;
          },
        }
			}
		},
	},
	plugins: [],
}

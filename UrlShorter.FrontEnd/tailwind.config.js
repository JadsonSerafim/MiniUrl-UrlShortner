/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',   
          active:  'var(--color-primary-active)',   
          disabled:'#a8b8cc',   
        },

        
        canvas:  'var(--color-canvas)',     
        surface: {
          DEFAULT:  'var(--color-surface)',  
          soft:     'var(--color-surface-soft)',  
        },

        
        hairline: {
          DEFAULT: 'var(--color-hairline)',   
          soft:    'var(--color-hairline-soft)',   
        },

        
        ink:   'var(--color-ink)',       
        body:  'var(--color-body)',       
        muted: 'var(--color-muted)',       
      },

      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },

      fontSize: {
        
        'display-mega': ['80px', { lineHeight: '1.0', letterSpacing: '-2px', fontWeight: '400' }],
        'display-xl':   ['64px', { lineHeight: '1.0', letterSpacing: '-1.6px', fontWeight: '400' }],
        'display-lg':   ['52px', { lineHeight: '1.0', letterSpacing: '-1.3px', fontWeight: '400' }],
        'display-md':   ['44px', { lineHeight: '1.09', letterSpacing: '-1px', fontWeight: '400' }],
        'display-sm':   ['36px', { lineHeight: '1.11', letterSpacing: '-0.5px', fontWeight: '400' }],
        
        'title-lg':     ['32px', { lineHeight: '1.13', letterSpacing: '-0.4px' }],
        'title-md':     ['18px', { lineHeight: '1.33', fontWeight: '600' }],
        'title-sm':     ['16px', { lineHeight: '1.25', fontWeight: '600' }],
        'body-md':      ['16px', { lineHeight: '1.5' }],
        'body-sm':      ['14px', { lineHeight: '1.5' }],
        'caption':      ['13px', { lineHeight: '1.5' }],
        'caption-sm':   ['12px', { lineHeight: '1.5', fontWeight: '600' }],
        'number':       ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'btn':          ['16px', { lineHeight: '1.15', fontWeight: '600' }],
        'nav':          ['14px', { lineHeight: '1.4', fontWeight: '500' }],
      },

      
      spacing: {
        'section': '96px',
        'card':    '32px',
      },

      
      borderRadius: {
        'none': '0px',
        'xs':   '4px',
        'sm':   '8px',
        'md':   '12px',    
        'lg':   '16px',
        'xl':   '24px',    
        'pill': '100px',   
        'full': '9999px',  
      },

      
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.25)',
        'card': '0 0 0 1px rgba(255, 255, 255, 0.06)',
      },

      
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
}

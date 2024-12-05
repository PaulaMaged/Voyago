const themes = {
  default: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',
    secondary: '#2ecc71',
    secondaryDark: '#27ae60',
    secondaryLight: '#82e0aa',
    accent: '#9b59b6',
    accentDark: '#8e44ad',
    accentLight: '#bb8fce',
    background: '#f8f9fa',
    surface: '#ffffff',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(46, 204, 113, 0.2)',
    hoverActive: 'rgba(39, 174, 96, 0.3)',
    selection: 'rgba(52, 152, 219, 0.2)',
    selectionText: '#2c3e50'
  },
  spring: {
    primary: '#FF9EAA',
    primaryDark: '#FF8B99',
    primaryLight: '#FFBDC5',
    secondary: '#98D8AA',
    secondaryDark: '#7BC68C',
    secondaryLight: '#B5E4C3',
    accent: '#FFB07F',
    accentDark: '#FF9B61',
    accentLight: '#FFC5A3',
    background: '#FFF8F0',
    surface: '#ffffff',
    textPrimary: '#4A4E69',
    textSecondary: '#9A8C98',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(152, 216, 170, 0.2)',
    hoverActive: 'rgba(123, 198, 140, 0.3)',
    selection: 'rgba(255, 158, 170, 0.2)',
    selectionText: '#4A4E69'
  },
  summer: {
    primary: '#FF6B6B',         // Warm Coral
    primaryDark: '#FF5252',
    primaryLight: '#FF8585',
    secondary: '#4ECDC4',       // Ocean Turquoise
    secondaryDark: '#45B7AE',
    secondaryLight: '#6FF7EE',
    accent: '#FFD93D',          // Sunny Yellow
    accentDark: '#FFC107',
    accentLight: '#FFE469',
    background: '#F8F9FA',
    surface: '#ffffff',
    textPrimary: '#2D3436',
    textSecondary: '#636E72',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(78, 205, 196, 0.2)',     // Semi-transparent turquoise
    hoverActive: 'rgba(69, 183, 174, 0.3)',
    selection: 'rgba(255, 107, 107, 0.2)', // Semi-transparent coral
    selectionText: '#2D3436'
  },
  autumn: {
    primary: '#D35400',         // Burnt Orange
    primaryDark: '#BA4A00',
    primaryLight: '#E67E22',
    secondary: '#C0392B',       // Deep Red
    secondaryDark: '#A93226',
    secondaryLight: '#D64541',
    accent: '#F1C40F',          // Golden Yellow
    accentDark: '#D4AC0D',
    accentLight: '#F4D03F',
    background: '#FDF6E3',      // Warm Beige
    surface: '#ffffff',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(192, 57, 43, 0.2)',      // Semi-transparent deep red
    hoverActive: 'rgba(169, 50, 38, 0.3)',
    selection: 'rgba(211, 84, 0, 0.2)',    // Semi-transparent burnt orange
    selectionText: '#2C3E50'
  }
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  Object.keys(theme).forEach(property => {
    document.documentElement.style.setProperty(`--${property}`, theme[property]);
  });

  const style = document.createElement('style');
  style.textContent = `
    ::selection {
      background-color: ${theme.selection};
      color: ${theme.selectionText};
    }
    ::-moz-selection {
      background-color: ${theme.selection};
      color: ${theme.selectionText};
    }
  `;
  
  const prevStyle = document.querySelector('#theme-selection-style');
  if (prevStyle) {
    prevStyle.remove();
  }
  
  style.id = 'theme-selection-style';
  document.head.appendChild(style);
};

export default themes; 
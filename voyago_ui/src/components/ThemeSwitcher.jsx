import React from 'react';
import { 
  FaLeaf,          // Spring
  FaSun,           // Summer
  FaCanadianMapleLeaf,  // Autumn
  FaMoon,           // Default/Dark
  FaCloudRain      // Rainy Drops
} from 'react-icons/fa';

export default function ThemeSwitcher({ onThemeChange, currentTheme, isHovered }) {
  const themes = [
    { name: 'default', icon: FaMoon, label: 'Default Theme' },
    { name: 'spring', icon: FaLeaf, label: 'Spring Theme' },
    { name: 'summer', icon: FaSun, label: 'Summer Theme' },
    { name: 'autumn', icon: FaCanadianMapleLeaf, label: 'Autumn Theme' },
    { name: 'rainyDrops', icon: FaCloudRain, label: 'Rainy Drops Theme' }
  ];

  const nextTheme = () => {
    const currentIndex = themes.findIndex(theme => theme.name === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex].name;
  };

  const ThemeIcon = themes.find(theme => theme.name === currentTheme)?.icon || FaMoon;

  return (
    <button
      onClick={() => onThemeChange(nextTheme())}
      className="theme-switcher dashboard-button"
      title={`Switch to ${nextTheme()} theme`}
    >
      <ThemeIcon className="text-xl" />
      {isHovered && (
        <span className="theme-label ml-3">
          {themes.find(theme => theme.name === currentTheme)?.label || 'Change Theme'}
        </span>
      )}
    </button>
  );
} 
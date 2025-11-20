import { Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

const WeatherIcon = ({ condition, size = 24, className = '' }) => {
  const getIcon = () => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun size={size} className={`text-yellow-500 ${className}`} />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud size={size} className={`text-gray-500 ${className}`} />;
      case 'rain':
      case 'rainy':
        return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
      case 'snow':
      case 'snowy':
        return <CloudSnow size={size} className={`text-blue-200 ${className}`} />;
      case 'storm':
      case 'thunderstorm':
        return <Zap size={size} className={`text-purple-500 ${className}`} />;
      default:
        return <Sun size={size} className={`text-yellow-500 ${className}`} />;
    }
  };

  return getIcon();
};

export default WeatherIcon;
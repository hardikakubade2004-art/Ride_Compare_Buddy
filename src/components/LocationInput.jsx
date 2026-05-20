import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LocationInput = ({ placeholder = "Where are you going?", icon: Icon = Search, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/search');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-center mx-4 -mt-6 relative z-10 bg-white rounded-2xl shadow-lg border border-slate-100 p-4 cursor-pointer hover:shadow-xl premium-transition"
    >
      <div className="bg-slate-100 p-2 rounded-full mr-3 text-slate-500">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold text-slate-800">
          {placeholder}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;

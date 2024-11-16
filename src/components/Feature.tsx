// components/Feature.tsx
type FeatureProps = {
  title: string;
  description: string;
  icon: string; // URL to icon
};

const Feature: React.FC<FeatureProps> = ({ title, description, icon }) => {
  return (
    <div className="flex items-center bg-black text-white p-6 rounded-lg shadow-lg">
      <img src={icon} alt={title} className="w-12 h-12 mr-6" />
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Feature;

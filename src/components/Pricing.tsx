// components/Pricing.tsx
const Pricing = () => {
  return (
    <section className="grid grid-cols-3 gap-6 py-16 bg-black text-white text-center">
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="text-2xl font-bold">Free</h3>
        <p className="mt-4">Basic plan with limited features</p>
        <p className="mt-2">$0/month</p>
        <button className="mt-6 bg-pink-600 px-4 py-2 rounded-md">Start Free</button>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="text-2xl font-bold">Standard</h3>
        <p className="mt-4">Best for individuals</p>
        <p className="mt-2">$99/month</p>
        <button className="mt-6 bg-pink-600 px-4 py-2 rounded-md">Start Standard</button>
      </div>
      <div className="border border-gray-700 p-6 rounded-lg">
        <h3 className="text-2xl font-bold">Premium</h3>
        <p className="mt-4">Best for large teams</p>
        <p className="mt-2">$199/month</p>
        <button className="mt-6 bg-pink-600 px-4 py-2 rounded-md">Start Premium</button>
      </div>
    </section>
  );
};

export default Pricing;

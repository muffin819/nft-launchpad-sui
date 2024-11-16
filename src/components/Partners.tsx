import Image from "next/image";

const Partner = () => {
  return (
    <div>
      <div className="flex justify-around">
        {new Array(5).fill(" ").map((item: any, idx: number) => (
          <Image src={`/assets/img/partner-${idx + 1}.svg`} width={300} height={300} alt={`partner ${idx + 1}`} key={idx} className="w-24 h-24 grayscale hover:grayscale-0 rounded-full shadow-none hover:shadow-[0_0px_60px_0px_rgba(107,177,255,0.6)] cursor-pointer" />
        ))}
      </div>
      <p className="text-center text-white opacity-60">our partners</p>
    </div>
  );
};

export default Partner;
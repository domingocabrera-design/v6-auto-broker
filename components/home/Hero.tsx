import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-black text-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Buy From Copart{" "}
          <span className="text-blue-500">Without a Dealer License</span>
        </h1>

        <p className="mt-3 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Dealer access to U.S. auto auctions with full broker support.
        </p>

        <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
          <a href="/pricing" className="btn-primary w-full md:w-auto">
            Subscribe Today
          </a>
          <a href="/browse" className="btn-secondary w-full md:w-auto">
            Browse Vehicles
          </a>
        </div>

        <div className="mt-10">
          <Image
            src="/cars/land-cruiser.png"
            alt="Featured vehicles"
            width={1200}
            height={500}
            priority
            className="mx-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import heroBg from "../assets/NexCart-home-image.png";
import showcaseBg from "/img/exploreproduct.png";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import ProductCard from "../components/ProductCard";

const slides = [
  {
    tag: "Big Saving Days",
    title: "Shop more. Save more. Get it fast.",
    text: "NexCart brings daily deals, useful products and a simple shopping flow in one clean store.",
    image: "/img/slidebar/Gemini_Generated_Image_u3q0x1u3q0x1u3q0.png",
    button: "Shop Now",
    color: "bg-[#2874f0]",
    imageBg: "bg-[#eaf2ff]",
  },
  {
    tag: "Electronics Sale",
    title: "Top gadgets for work and home.",
    text: "Grab headphones, speakers, keyboards and daily tech products at fresh prices.",
    image: "/img/slidebar/Gemini_Generated_Image_qro2riqro2riqro2.png",
    button: "View Electronics",
  },
  {
    tag: "Weekend Offers",
    title: "Fashion, home and beauty picks.",
    text: "Find useful products across categories with clean pricing and easy checkout.",
    image: "/img/slidebar/Gemini_Generated_Image_gbmvhhgbmvhhgbmv.png",
    button: "Explore Deals",
  },
  {
    tag: "Seasonal Favorites",
    title: "Upgrade Your Everyday Style",
    text: "Explore our new arrivals and find your perfect casual look for the season.",
    image: "/img/slidebar/seasonalfav.png",
    button: "Shop Now",
  },
  {
    tag: "Footwear Deal",
    title: "Step into comfort and comfort.",
    text: "Grab up to 30% off on premium running shoes, daily sneakers, and casual streetwear kicks.",
    image: "/img/slidebar/Gemini_Generated_Image_ancp5jancp5jancp.png",
    button: "Claim Offer",
  }
];

const offerCards = [
  { title: "Best of Electronics", text: "Headphones, speakers and gadgets", price: "From Rs. 399" },
  { title: "Fashion Deals", text: "Shoes, bags, watches and more", price: "Min. 40% off" },
  { title: "Home Makeover", text: "Decor, lights and storage", price: "From Rs. 199" },
];

const services = [
  { title: "Fast Delivery", text: "Quick shipping on ready stock", icon: Truck },
  { title: "Easy Returns", text: "Simple return request flow", icon: RotateCcw },
  { title: "Secure Payments", text: "Protected checkout with Razorpay", icon: ShieldCheck },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((oldSlide) => {
      if (oldSlide === slides.length - 1) {
        return 0;
      }

      return oldSlide + 1;
    });
  };

  const prevSlide = () => {
    setActiveSlide((oldSlide) => {
      if (oldSlide === 0) {
        return slides.length - 1;
      }

      return oldSlide - 1;
    });
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json().catch(() => []);
        if (res.ok && Array.isArray(data)) {
          setProducts(data.slice(0, 8));
        }
      } catch (error) {
        setProducts([]);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pb-8">
      <div className="main-content">
        <section className="relative overflow-hidden rounded-sm bg-white shadow-sm">
          <div
  className="flex transition-transform duration-500"
  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
>
  {slides.map((slide, index) => (
    <div 
      className="relative min-w-full h-[450px] lg:h-[500px] overflow-hidden bg-cover bg-center" 
      style={{ backgroundImage: `url(${slide.image})` }}
      key={slide.title}
    >

      <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-900/80 to-transparent flex flex-col justify-center p-6 text-white sm:p-12 md:p-16 max-w-xl md:max-w-2xl lg:max-w-3xl">
        
        {/* Tag */}
        <div className="mb-4 flex w-fit items-center gap-2 rounded bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm border border-white/10">
          <BadgePercent className="h-4 w-4" />
          {slide.tag}
        </div>
        
        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl tracking-tight">
          {slide.title}
        </h1>
        
        {/* Text Description */}
        <p className="mb-6 max-w-xl text-sm sm:text-base leading-relaxed text-gray-200">
          {slide.text}
        </p>
        
        {/* Buttons / CTA Section */}
        <div className="flex flex-wrap gap-3">
          <Link to="/shop" className="btn-yellow flex items-center gap-2">
            {index === 0 && user ? "Continue Shopping" : slide.button}
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          {!user && index === 0 && (
            <Link
              to="/register"
              className="rounded bg-white px-5 py-3 text-sm font-semibold text-[#2874f0] hover:bg-blue-50 transition-colors"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:text-[#2874f0]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:text-[#2874f0]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                className={
                  activeSlide === index
                    ? "h-2 w-6 rounded-full bg-white"
                    : "h-2 w-2 rounded-full bg-white/60"
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {offerCards.map((offer) => (
            <Link to="/shop" key={offer.title} className="bg-white p-5 shadow-sm hover:shadow-md">
              <p className="text-sm font-semibold text-green-600">{offer.price}</p>
              <h2 className="mt-2 text-xl font-semibold">{offer.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{offer.text}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#2874f0]">View offers</span>
            </Link>
          ))}
        </section>

        {products.length > 0 && (
          <section className="mt-5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div>
                <h2 className="text-xl font-semibold">Deals of the Day</h2>
                <p className="text-sm text-gray-500">Fresh picks from the store</p>
              </div>
              <Link to="/shop" className="rounded bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white">
                View All
              </Link>
            </div>
            <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase text-[#2874f0]">NexCart Assured</p>
                <h2 className="mt-2 text-2xl font-semibold">Useful shopping without the mess.</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Browse by category, compare prices, add items to cart and checkout from one place.
                </p>
                <Link to="/shop" className="btn mt-5 w-fit">
                  Explore Store
                </Link>
              </div>
              <img src={showcaseBg} alt="NexCart products" className="h-72 w-full object-contain" />
            </div>
          </div>

          <div className="grid gap-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div key={service.title} className="flex gap-4 bg-white p-5 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 text-[#2874f0]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{service.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;

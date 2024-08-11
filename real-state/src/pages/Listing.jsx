import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaParking, FaShare } from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listing, setListing] = useState(null);
  const params = useParams();

  // console.log(listing);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]); //If we pass empty array it will run only once,otherwise it will run everytime the component renders

  return (
    <main>
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {error && <p className="text-2xl text-center my-7">Some went wrong!</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              // console.log(url);
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="fixed top-[13%] right-[3%] z-10 bourder 
                            rounded-full w-12 h-12 flex justify-center items-center
                          bg-slate-100 cursor-pointer"
          >
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p
              className="fixed top-[23%] right-[5%] z-10 rounded-md
                                bg-slate-100 p-2"
            >
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " /  month"}
            </p>

            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkedAlt className="text-green-700 w-5 h-5" />
              {listing.address}
            </p>

            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $ {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex items-center flex-wrap gap-4 sm:gap-6">
                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaBed className="text-lg"/>
                    {listing.bedrooms > 1 
                        ? `${listing.bedrooms} beds`
                        :  `${listing.bedrooms} bed`
                    }
                </li>

                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaBath className="text-lg"/>
                    {listing.bathrooms > 1 
                        ? `${listing.bathrooms} baths`
                        :  `${listing.bathrooms} bath`
                    }
                </li>

                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaParking className="text-lg" />
                    {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>

                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaChair className="text-lg" />
                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
            </ul>
            
          </div>
        </div>
      )}
    </main>
  );
}

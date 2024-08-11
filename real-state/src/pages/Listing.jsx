import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'


export default function Listing() {
    SwiperCore.use([Navigation])
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const params = useParams();

    // console.log(listing);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.id}`);
                const data = await res.json();

                if (data.success === false) {
                    setError(true);
                    setLoading(false)
                    return;
                }
                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.id])  //If we pass empty array it will run only once,otherwise it will run everytime the component renders

    return (
        <main>
            {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
            {error && <p className='text-2xl text-center my-7'>Some went wrong!</p>}
            {listing && !loading && !error &&
                (
                    <div>
                        <Swiper navigation>
                            {listing.imageUrls.map((url) => (
                                // console.log(url);
                                <SwiperSlide key={url}>
                                    <div className='h-[550px]'
                                        style={{
                                            background: `url(${url}) center no-repeat`,
                                            backgroundSize: 'cover',
                                        }}
                                    ></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )
            }
        </main>
    )
}

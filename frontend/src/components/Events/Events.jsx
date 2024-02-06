import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2, // Adjust the number of cards shown at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className='mb-5'>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>ADS & Promotions</h1>
          </div>
          {allEvents.length > 0 ? (
            allEvents.length === 1 ? (
              <EventCard data={allEvents[0]} active={true} />
            ) : (
              <Slider {...settings}>
                {allEvents.map((event, index) => (
                  <div key={index}>
                    <EventCard data={event} active={true} />
                  </div>
                ))}
              </Slider>
            )
          ) : (
            <h4>'Events not available!'</h4>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;

import React from "react";
import styles from "../../styles/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Sponsored = () => {

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Adjust the number of slides shown at once
    slidesToScroll: 1,
  };

  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl justify-between`}
    >
      <Slider {...sliderSettings}>
        <div className="flex justify-between w-full">
          <div className="flex items-start">
            <img
              src="https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png"
              alt=""
              style={{width:"100px", objectFit:"contain"}}
            />
          </div>
          <div className="flex items-start">
            <img
              src="https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png"
              style={{width:"100px", objectFit:"contain"}}
              alt=""
            />
          </div>
          <div className="flex items-start">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/2560px-LG_logo_%282015%29.svg.png"
              style={{width:"100px", objectFit:"contain"}}
              alt=""
            />
          </div>
          <div className="flex items-start">
            <img
              src="https://www.vectorlogo.zone/logos/apple/apple-ar21.png"
              style={{width:"100px", objectFit:"contain"}}
              alt=""
            />
          </div>
          <div className="flex items-start">
            <img
              src="https://www.vectorlogo.zone/logos/apple/apple-ar21.pn"
              style={{width:"100px", objectFit:"contain"}}
              alt=""
            />
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Sponsored;

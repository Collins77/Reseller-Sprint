import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/styles";
import SupplierCard from "../SupplierCard/SupplierCard";
import { getAllSuppliers } from "../../../redux/actions/sellers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const BestDeals = () => {
  const dispatch = useDispatch();
  const {sellers} = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllSuppliers());
  }, [dispatch]);
  
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2.5, // You can adjust the number of slides shown at once
    slidesToScroll: 1,
  };

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Suppliers</h1>
        </div>
        {/* <div className="flex justify-between"> */}
          <Slider {...sliderSettings}>
              {sellers &&
                sellers.length !== 0 &&
                sellers.map((i, index) => (
                  <div className="flex justify-between gap-4">
                    <SupplierCard data={i} key={index} />
                  </div>
                ))}
          </Slider>
          {/* </div> */}
      </div>
    </div>
  );
};

export default BestDeals;

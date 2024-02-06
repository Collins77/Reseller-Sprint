import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import SupplierCard from "../components/Route/SupplierCard/SupplierCard";
import { getAllSellers } from "../redux/actions/sellers";

const SuppliersPage = () => {
  const dispatch = useDispatch();
  const { sellers, isLoading } = useSelector((state) => state.seller);
  // const [data, setData] = useState([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const filteredSellers = sellers && sellers.filter((seller) => seller.status !== 'On Hold');

  return (
  <>
  {
    isLoading ? (
      <Loader />
    ) : (
      <div>
      <Header activeHeading={2} />
      <br />
      <br />          
      <div className={`${styles.section}`}>
        <div className="mb-2">
              <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, fontSize: "12px", color: "#000000ff" }}>
                <li><a href="/">Home/</a></li>
                {pathnames.map((name, index) => (
                  <li key={index}><a href={`/${name}`}>{name}</a></li>
                ))}
              </ul>
        </div>
        <div className='w-full bg-orange-200 mb-3 h-[50px] flex items-center justify-center'>
          <h1 className="font-bold text-center text-3xl">Suppliers</h1>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredSellers.map((i, index) => <SupplierCard data={i} key={index} />)}
        </div>
        {filteredSellers.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No Suppliers Found!
              </h1>
        ) : null}
      </div>
      <Footer />
    </div>
    )
  }
  </>
  );
};

export default SuppliersPage;
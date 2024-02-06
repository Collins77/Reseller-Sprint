import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { server } from "../../server";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";

const ShopInfo = ({ isOwner }) => {
  const [data,setData] = useState({});
  const {products} = useSelector((state) => state.products);
  const [isLoading,setIsLoading] = useState(false);
  const {id} = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageUrl = "https://img.freepik.com/free-vector/conveyor-belt-warehouse-concept-illustration_114360-17998.jpg?w=1380&t=st=1702388516~exp=1702389116~hmac=2ab5ddf2c7e14e478d700d47e2aa12cf8e718d250e20f1afb000d65df81ba805";

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
     setData(res.data.shop);
     setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, [dispatch, id])
  

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`,{
      withCredentials: true,
    });
    window.location.reload();
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };



  return (
   <>
   {
    isLoading  ? (
      <Loader />
    ) : (
    <div className="w-full shadow-sm border border-orange-500 bg-white p-3">
      <div className="flex w-full justify-between bg-orange-300 p-4 h-1/4 mb-4 border-b-2 border-black gap-2">
        <img src={imageUrl} alt="" className="w-1/5 h-full" />
        <div className="w-3/4 h-full flex flex-col gap-1">
          <h2 className="font-bold text-black">{data.name}</h2>
          <span className="text-sm text-gray-500">{data.address}</span>
          <span className="text-sm text-gray-500">{data.category}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-gray-500">Dollar Exchange Rate</p>
          <span className="text-gray-500">KES {data.exchangeRate}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Phone Number</p>
          <span className="text-gray-500">{data.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Joined on</p>
          <span className="text-gray-500">{data?.createdAt?.slice(0, 10)}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Total Products</p>
          <span className="text-gray-500">{products && products.length}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Category</p>
          <span className="text-gray-500">{data.category}</span>
        </div>
      </div>
      <div>
      <div>
        <button onClick={handleMessageSubmit} className="w-full rounded-full font-bold border border-orange-500 bg-transparent hover:bg-orange-400 hover:text-white text-black hover:border-transparent py-2">
          Message Seller
        </button>
        {isOwner && (
        <div className="py-3 px-4">
           <Link to="/settings">
            <button className="w-full rounded-full font-bold border border-orange-500 bg-transparent hover:bg-orange-400 hover:text-white text-black hover:border-transparent py-2">
              Settings
            </button>
           </Link>
          <button onClick={logoutHandler} className="w-full rounded-full font-bold border border-orange-500 bg-transparent hover:bg-orange-400 hover:text-white text-black hover:border-transparent py-2">
           Logout
        </button>
        </div>
      )}
      </div>
      </div>
    </div>
    )
   }
   </>
  );
};

export default ShopInfo;

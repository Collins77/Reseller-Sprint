import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
    //   payload: error.response.data.message,
    });
  }
};

export const getAllSuppliers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSuppliersRequest",
    });

    const { data } = await axios.get(`${server}/shop/get-all-sellers`);
    dispatch({
      type: "getAllSuppliersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSuppliersFailed",
      payload: error.response.data.message,
    });
  }
};

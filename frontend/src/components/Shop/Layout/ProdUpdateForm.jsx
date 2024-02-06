import React, { useEffect, useState } from "react";
import { BrandData, categoriesData } from "../../../static/data";
// import { toast } from "react-toastify";

const ProdUpdateForm = ({ product, handleUpdateProduct }) => {
  const [updatedData, setUpdatedData] = useState({
    name: product.name,
    description: product.description,
    partNumber: product.partNumber,
    category: product.category,
    brand: product.brand,
    warranty: product.warranty,
    discountPrice: product.discountPrice,
    isAvailable: product.isAvailable,
    stock: product.stock,
    // Add other fields as needed
  });

  useEffect(() => {
    // When the component mounts, update the state with the product details
    setUpdatedData({
      name: product.name,
      description: product.description,
      partNumber: product.partNumber,
      category: product.category,
      brand: product.brand,
      warranty: product.warranty,
      discountPrice: product.discountPrice,
      isAvailable: product.isAvailable,
      stock: product.stock,
      // Add other fields as needed
    });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Call the handleUpdateProduct function with the updated data
    handleUpdateProduct(updatedData);
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Update Product</h5>
      {/* Update product form */}
      <form onSubmit={handleUpdate}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={updatedData.name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={updatedData.description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Part Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="partNumber"
            value={updatedData.partNumber}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product part number..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={updatedData.category}
            onChange={handleChange}
            name="category"
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title} name="category">
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={updatedData.brand}
            onChange={handleChange}
            name="brand"
          >
            <option value="Choose a brand">Choose a brand</option>
            {BrandData &&
              BrandData.map((i) => (
                <option value={i.title} key={i.title} name="brand">
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={updatedData.discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Availability <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={updatedData.isAvailable}
            onChange={handleChange}
            name="isAvailable"
          >
            <option name="isAvailable" value="available">Available</option>
            <option name="isAvailable" value="limited">Limited</option>
            <option name="isAvailable" value="unavailable">Unavailable</option>
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={updatedData.stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product stock..."
          />
        </div>
        <div>
          <label className="pb-2">
            Warranty in months <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="warranty"
            value={updatedData.warranty}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product warranty period in months..."
          />
        </div>
        <br />
        <div>
          <input
            type="submit"
            value="Update"
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default ProdUpdateForm;

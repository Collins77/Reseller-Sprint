import { Link } from "react-router-dom";

const SupplierCard = ({ data,isEvent }) => {

  return (
    <>
        <Link to={`/shop/preview/${data?._id}`}>
          <div class="w-full p-6 bg-white border border-orange-700 rounded-lg shadow dark:border-orange-700 mb-3">
              {/* <img className="w-8 h-8 mb-1 rounded-full" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" src={`${data.avatar?.url}`}/> */}
              <Link to={`/shop/preview/${data?._id}`}>
                  <h5 className="mb-1 text-xl font-semibold tracking-tight text-blue-600 dark:text-black">{data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}</h5>
              </Link>
              <div className="mb-2 flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-gray-500">Dollar Exchange Rate</p>
                <span className="text-gray-500">KES {data.exchangeRate}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Category</p>
                <span className="text-gray-500">{data.category}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Address</p>
                <span className="text-gray-500">{data.address}</span>
              </div>
              </div>
              <a href={`/shop/preview/${data?._id}`} className="inline-flex items-center text-blue-600 hover:underline">
                <Link to={`/shop/preview/${data?._id}`} className="inline-flex items-center text-blue-600 hover:underline">
                  See our Inventory
                  <svg class="w-3 h-3 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                  </svg>
                </Link>
              </a>
          </div>
        </Link>
    </>
  )
}

export default SupplierCard;
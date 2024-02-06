import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";
import ActionsCell from "./ActionCell";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
    .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
    .then((res) => {
      toast.success(res.data.message);
    });

  dispatch(getAllSellers());
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${server}/shop/approve-seller/${id}`, null, {
        withCredentials: true,
      });
      toast.success("Seller approved successfully!");
      dispatch(getAllSellers());
    } catch (error) {
      toast.error("Error approving seller");
      console.error("Error approving seller:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${server}/shop/reject-seller/${id}`,
        null,
        { withCredentials: true }
      );
      toast.success("Seller rejected successfully!");
      dispatch(getAllSellers());
    } catch (error) {
      toast.error("Error rejecting seller");
      console.error("Error rejecting seller:", error);
    }
  };
  const handleOnHold = async (id) => {
    try {
      await axios.put(
        `${server}/shop/on-hold-seller/${id}`,
        null,
        { withCredentials: true }
      );
      toast.success("Seller put on hold");
      dispatch(getAllSellers());
    } catch (error) {
      toast.error("Error putting seller on hold");
      console.error("Error putting seller on hold:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
        field: "  ",
        flex: 1,
        minWidth: 80,
        headerName: "Preview Shop",
        type: "number",
        sortable: false,
        renderCell: (params) => {
          return (
            <>
            <Link to={`/shop/preview/${params.id}`}>
            <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
            </>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 130,
        flex: 0.7,
        renderCell: (params) => {
          const status = params.row.status;
  
          return (
            <div
              style={{
                color: 
                status === "Approved"
                  ? "green"
                  : status === "Not approved"
                  ? "blue"
                  : status === "On Hold"
                  ? "orange"
                  : "red",
                fontWeight: "bold",
              }}
            >
              {status}
            </div>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",
        flex: 1,
        minWidth: 250,
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: (params) => (
          // <>
          //   <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          //     <AiOutlineDelete size={15} />
          //   </Button>
          //   {params.row.status !== "Approved" && (
          //     <Button onClick={() => handleApprove(params.id)}>
          //       <TiTick size={15} color="green" style={{borderRadius: '50%'}} />
          //     </Button>
          //   )}
          //   {params.row.status !== "Rejected" && (
          //     <Button onClick={() => handleReject(params.id)}>
          //       <RxCross2 size={15} color="red" style={{borderRadius: '50%'}} />
          //     </Button>
          //   )}
          //   {params.row.status !== "On Hold" && (
          //   <Button onClick={() => handleOnHold(params.id)}>
          //     <TbHandStop size={15} color="blue" style={{borderRadius: '50%'}}  />
          //   </Button>
          //   )}
          // </>
          <ActionsCell
          row={params.row}
          handleDelete={handleDelete}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleOnHold={handleOnHold}
        />
        ),
      },
  ];

  const row = [];
  sellers &&
  sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        status: item?.status,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Sellers</h3>
        <Link to="/admin-create-seller" className="flex w-full justify-end mb-3">
          <Button variant="contained" color="primary" >
            Add New Seller
          </Button>
        </Link>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this seller?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() =>  setOpen(false) || handleDelete(userId)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;

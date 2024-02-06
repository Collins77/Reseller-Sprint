import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import ActionsCell from "./ActionCell";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
    .delete(`${server}/shop/delete-user/${id}`, { withCredentials: true })
    .then((res) => {
      toast.success(res.data.message);
    });

  dispatch(getAllUsers());
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${server}/user/approve-user/${id}`, null, {
        withCredentials: true,
      });
      toast.success("User approved successfully!");
      dispatch(getAllUsers());
    } catch (error) {
      toast.error("Error approving user");
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${server}/user/reject-user/${id}`,
        null,
        { withCredentials: true }
      );
      toast.success("User rejected successfully!");
      dispatch(getAllUsers());
    } catch (error) {
      toast.error("Error rejecting user");
      console.error("Error rejecting user:", error);
    }
  };
  const handleOnHold = async (id) => {
    try {
      await axios.put(
        `${server}/user/user-on-hold/${id}`,
        null,
        { withCredentials: true }
      );
      toast.success("User put on hold");
      dispatch(getAllUsers());
    } catch (error) {
      toast.error("Error putting user on hold");
      console.error("Error putting user on hold:", error);
    }
  };

  // const handleDelete = async (id) => {
  //   await axios
  //   .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
  //   .then((res) => {
  //     toast.success(res.data.message);
  //   });

  // dispatch(getAllUsers());
  // };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },

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
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
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
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
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
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        status: item.status,
        joinedAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
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
                Are you sure you wanna delete this user?
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

export default AllUsers;

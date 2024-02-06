import React, { useState } from "react";
import { Button, Menu, MenuItem, Modal } from "@material-ui/core";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SellerUpdateForm from "./SellerUpdateForm";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { TbHandStop } from "react-icons/tb";

const ActionsCell = ({ row, handleDelete, handleApprove, handleReject, handleOnHold }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateSeller = async (sellerId, updatedData) => {
    try {
      // Make an HTTP request to update the seller data
      const response = await axios.put(
        `${server}/shop/admin-update-seller/${sellerId}`,
        updatedData
      );

      // Check if the update was successful (you may need to adjust based on your API response)
      if (response.data.success) {
        toast.success("Seller updated successfully!", response.data.seller);
        // console.log("Seller updated successfully:", response.data.seller);
      } else {
        toast.error("Error updating seller", response.data.message);
        console.error("Failed to update seller:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      console.error("Error updating seller:", error.message);
    }
  };

  const handleUpdateClick = () => {
    setUpdateModalOpen(true);
    handleClose(); // Close the menu when opening the modal
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick}>
      <MoreVertIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        
        {row.status !== "Approved" && (
          <MenuItem onClick={() => handleApprove(row.id)}>
            <TiTick size={15} color="green" style={{ borderRadius: "50%" }} />
            Approve 
          </MenuItem>
        )}
        {row.status !== "Rejected" && (
          <MenuItem onClick={() => handleReject(row.id)}>
            <RxCross2 size={15} color="red" style={{ borderRadius: "50%" }} />
            Reject
          </MenuItem>
        )}
        {row.status !== "On Hold" && (
          <MenuItem onClick={() => handleOnHold(row.id)}>
            <TbHandStop size={15} color="blue" style={{ borderRadius: "50%" }} />
            Hold 
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(row.id)}>
          Delete 
        </MenuItem>
        <MenuItem onClick={handleUpdateClick}>
          Update 
        </MenuItem>
      </Menu>
      {/* Update Seller Modal */}
      <Modal
        open={isUpdateModalOpen}
        onClose={handleUpdateClose}
        aria-labelledby="update-seller-modal"
        aria-describedby="update-seller-modal-description"
      >
        <div>
          {/* Pass the seller data and an update function to the modal */}
          <SellerUpdateForm
            seller={row}
            handleUpdateSeller={handleUpdateSeller}
          />
        </div>
      </Modal>
    </>
  );
};

export default ActionsCell;

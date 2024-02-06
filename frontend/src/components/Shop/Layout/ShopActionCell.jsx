import React, { useState } from "react";
import { Button, Menu, MenuItem, Modal, CircularProgress, Backdrop } from "@material-ui/core";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProdUpdateForm from "./ProdUpdateForm"; // Import your product update form
// import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../../redux/actions/product";


const ProductActionCell = ({ row, handleDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateClick = () => {
    // Open the update modal
    setUpdateModalOpen(true);
    // Close the options menu
    handleClose();
  };

  const handleUpdateClose = () => {
    // Close the update modal
    setUpdateModalOpen(false);
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      setIsUpdating(true);

      // Dispatch the updateProduct action with the product ID and updated data
      dispatch(updateProduct(row.id, updatedData));

      // Close the update modal
      handleUpdateClose();

      // Display a success toast (you can modify this based on your needs)
      toast.success("Product update initiated!");

    } catch (error) {
      // Handle any errors
      console.error("Error updating product:", error.message);
      // Display an error toast (you can modify this based on your needs)
      toast.error("Error updating product");
    } finally {
      setIsUpdating(false);
    }
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
        <MenuItem onClick={() => handleDelete(row.id)}>
          Delete
        </MenuItem>
        <MenuItem onClick={handleUpdateClick}>
          Update
        </MenuItem>
      </Menu>
      {/* Update Product Modal */}
      <Modal
        open={isUpdateModalOpen}
        onClose={handleUpdateClose}
        aria-labelledby="update-product-modal"
        aria-describedby="update-product-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {isUpdating ? (
            <CircularProgress />
          ) : (
            <ProdUpdateForm
              product={row}
              handleUpdateProduct={handleUpdateProduct}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductActionCell;

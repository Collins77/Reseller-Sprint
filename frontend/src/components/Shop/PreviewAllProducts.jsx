import { Switch, makeStyles, styled } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { Button, Stack, Typography } from "@mui/material";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AiOutlineEye } from "react-icons/ai";

const PreviewAllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { id } = useParams();
  const [selectedCurrency, setSelectedCurrency] = useState("KES"); 

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));


  const useStyles = makeStyles((theme) => ({
    // Add a class for USD currency
    usdPrice: {
      color: "green", // Change this color to the desired color for USD
    },
    // Add a class for Local currency
    localPrice: {
      color: "red", // Change this color to the desired color for Local currency
    },
  }));
  
  const classes = useStyles(); 
  // const headerText =
  //   selectedCurrency === "KES" ? "USD" : "KES";
  
  const handleCurrencyChange = () => {
    setSelectedCurrency((prevCurrency) => prevCurrency === "KES" ? "USD" : "KES")
  }
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
  }, [dispatch, id]);

  const columns = [
    { field: "id", headerName: "Product Id", hide: true, minWidth: 150, flex: 0.7 },
    { field: "partNumber", headerName: "Part Number", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Description",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: (
        <div>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>KES</Typography>
              <AntSwitch 
              checked={selectedCurrency === "USD"}
              onChange={handleCurrencyChange}
              name="currencySwitch"
              inputProps={{ "aria-label": "Currency Switch" }}
              />
              <Typography>USD</Typography>
          </Stack>
        </div>
      ),
      headerClassName:
        selectedCurrency === "USD"
          ? classes.usdHeader
          : classes.localHeader,
      minWidth: 200,
      flex: 0.6,
      renderCell: (params) => {
        const item = products.find((product) => product._id === params.row.id);

        const priceInUSD = item.discountPrice / item.shop.exchangeRate;
        const priceInLocal = item.discountPrice;
        
        

        return (
          <span>
            {selectedCurrency === "USD"
              ? `$${priceInUSD.toFixed(2)}`
              : `KES ${priceInLocal}`}
          </span>
        );
      },
    },
    {
      field: "isAvailable",
      headerName: "Availability",
      minWidth: 120,
      flex: 0.4,
      valueGetter: (params) => (params.row.isAvailable ? "Available" : "Out of Stock")
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "brand",
      headerName: "Brand",
      minWidth: 120,
      flex: 0.4,
    },
    
    {
      field: "warranty",
      headerName: "Warranty in mons",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "brand",
      headerName: "Brand",
      minWidth: 200,
      flex: 0.4,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const pdfColumns = [
    { field: "partNumber", headerName: "Part Number", width: 50 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "brand", headerName: "Brand", width: 80 },
    { field: "category", headerName: "Category", width: 80 },
    { field: "discountPrice", headerName: "Price", width: 50 },
    { field: "isAvailable", headerName: "isAvailable", width: 50, valueGetter: (params) => (params.row.isAvailable ? "Available" : "Out of Stock") },
    { field: "warranty", headerName: "Warranty", width: 30 },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      const shopName = item.shop ? item.shop.name : 'UnknownShop';
      row.push({
        id: item._id,
        partNumber: item.partNumber,
        name: item.name,
        category: item.category,
        discountPrice: item.discountPrice,
        brand: item.brand,
        warranty: item.warranty,
        isAvailable: item.isAvailable,
        sold: item?.sold_out,
        shop: shopName,
      });
    });

    // const handleExportToPDF = () => {
    //   const doc = new jsPDF();
  
    //   const columnsForPDF = ["Product Id", "Part Number", "Description", "Brand", "Category", "Price", "Availability", "Warranty"];
    //   const rowsForPDF = products.map(item => [
    //     item._id,
    //     item.partNumber,
    //     item.name,
    //     item.brand,
    //     item.category,
    //     selectedCurrency === "USD" ? `$${(item.discountPrice / item.shop.exchangeRate).toFixed(2)}` : `KES ${item.discountPrice}`,
    //     item.isAvailable ? "Available" : "Out of Stock",
    //     item.warranty,
    //   ]);
  
    //   doc.autoTable({
    //     head: [columnsForPDF],
    //     body: rowsForPDF,
    //   });
  
    //   doc.save('products.pdf');
    // };

    // const handleExportToPDF = () => {
    //   const gridContainer = document.getElementById("data-grid-container");
  
    //   html2canvas(gridContainer).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF();
    //     pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    //     pdf.save('products.pdf');
    //   });
    // };

    // const handleExportToPDF = () => {
    //   const pdf = new jsPDF();
  
    //   // Customize the table headers
    //   const headers = columns.map(column => ({
    //     title: column.headerName || column.field,
    //     dataKey: column.field,
    //   }));
  
    //   // Customize the table rows
    //   const tableRows = row.map(data => columns.map(column => data[column.field]));
  
    //   pdf.autoTable({
    //     head: [headers],
    //     body: tableRows,
    //   });
  
    //   pdf.save('products.pdf');
    // };
    // const handleExportToPDF = () => {
    //   const pdf = new jsPDF();
  
    //   // Customize the table headers
    //   const headers = columns.map(column => ({
    //     title: column.headerName || column.field,
    //     dataKey: column.field,
    //   }));
  
    //   // Customize the table rows
    //   const tableRows = row.map(data => columns.map(column => data[column.field]));
  
    //   // Set the column widths
    //   const columnWidths = columns.map(column => ({ columnWidth: column.minWidth || 50 }));
  
    //   pdf.autoTable({
    //     head: [headers],
    //     body: tableRows,
    //     startY: 20, // Adjust the starting Y position
    //     columnStyles: {
    //       name: { cellWidth: 'auto', halign: 'left', valign: 'top' }, // Customize the description column
    //     },
    //     margin: { top: 30 },
    //     styles: { overflow: 'linebreak' }, // Enable line breaks for long text
    //     columnWidths: columnWidths,
    //   });
  
    //   pdf.save('products.pdf');
    // };
    // const handleExportToPDF = () => {
    //   const pdf = new jsPDF();
  
    //   // Customize the table headers
    //   const headers = columns.map(column => ({
    //     title: column.headerName || column.field,
    //     dataKey: column.field,
    //   }));
  
    //   // Customize the table rows
    //   const tableRows = row.map(data => columns.map(column => data[column.field]));
  
    //   // Set the column widths
    //   const columnWidths = columns.map(column => {
    //     if (column.field === 'name') {
    //       return { columnWidth: 120 }; // Adjust the width for the 'name' column
    //     }
    //     return { columnWidth: column.minWidth || 50 };
    //   });
  
    //   pdf.autoTable({
    //     head: [headers],
    //     body: tableRows,
    //     startY: 20,
    //     columnStyles: {
    //       name: { cellWidth: 'auto', halign: 'left', valign: 'top' }, // Adjust the style for the 'name' column
    //     },
    //     margin: { top: 30 },
    //     styles: { overflow: 'linebreak' },
    //     columnWidths: columnWidths,
    //   });
  
    //   pdf.save('products.pdf');
    // };
    const handleExportToPDF = () => {
      const pdf = new jsPDF();
    
      // Customize the table headers for PDF export

  // Customize the table headers for PDF export
      const headers = pdfColumns.map(column => ({
        title: column.headerName || column.field,
        dataKey: column.field,
      }));

  // Customize the table rows for PDF export
        const tableRows = row.map(data => pdfColumns.map(column => data[column.field]));

        // Set the column widths for PDF export
        const columnWidths = pdfColumns.map(column => ({ columnWidth: column.width }));
        // const shopName = row.length > 0 ? row[0].shop.name : '';
        const shopName = row.length > 0 && row[0].shop ? row[0].shop : { name: 'UnknownShop' };

        pdf.autoTable({
          head: [headers],
          body: tableRows,
          startY: 20, // Adjust the starting position to leave space for the watermark and store name
          columnStyles: {
            name: { cellWidth: 'auto', halign: 'left', valign: 'top' },
          },
          margin: { top: 30 },
          styles: { overflow: 'linebreak' },
          columnWidths: columnWidths,
        });

      pdf.save(`${shopName}_products.pdf`);
      
    };
  return (
    <>
      
      {isLoading ? (
        <Loader />
      ) : (

          <div>
            <div className="flex justify-between w-full">
              <div>
                <label className="mb-2 mr-2">
                  Currency :
                </label>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>KES</Typography>
                  <AntSwitch 
                  checked={selectedCurrency === "USD"}
                  onChange={handleCurrencyChange}
                  name="currencySwitch"
                  inputProps={{ "aria-label": "Currency Switch" }}
                  />
                  <Typography>USD</Typography>
                </Stack>
              </div>
              <Button
              variant="outlined"
              color="primary"
              onClick={handleExportToPDF}
              className="mb-3"
              >
                Download as PDF
              </Button>
            </div>
            <div id="data-grid-container">
            <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: [''],
                },
              },
            }}
            columnVisibilityModel={{
              id: false,
              category: false,
              brand: false,
            }}
            // disableColumnFilter
            disableDensitySelector
            // slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            
          />
            </div>
          </div>
          
      )}
    </>
  );
};

export default PreviewAllProducts;

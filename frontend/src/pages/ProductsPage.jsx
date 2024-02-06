import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { Switch, makeStyles, styled } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";
import jsPDF from 'jspdf';

const ProductsPage = () => {
  // const { products, isLoading } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const {allProducts,isLoading} = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("KES"); 
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

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

  const handleCurrencyChange = () => {
    setSelectedCurrency((prevCurrency) => prevCurrency === "KES" ? "USD" : "KES")
  }

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

  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts;
      setData(d);
    } else {
      const d =
      allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
    //    window.scrollTo(0,0);
  }, [allProducts, categoryData]);

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
        const item = allProducts.find((product) => product._id === params.row.id);

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
      field: "warranty",
      headerName: "Warranty in mon",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "shop",
      headerName: "Supplier",
      minWidth: 120,
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
      minWidth: 120,
      flex: 0.4,
    },
    // {
    //   field: "Preview",
    //   flex: 0.8,
    //   minWidth: 100,
    //   headerName: "Preview",
    //   type: "number",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Link to={`/product/${params.id}`}>
    //           <Button>
    //             <AiOutlineEye size={20} />
    //           </Button>
    //         </Link>
    //       </>
    //     );
    //   },
    // },
  ];

  const row = [];

  allProducts &&
    allProducts.forEach((item) => {
      row.push({
        id: item._id,
        partNumber: item.partNumber,
        name: item.name,
        category: item.category,
        brand: item.brand,
        warranty: item.warranty,
        shop: item.shop.name,
        isAvailable: item.isAvailable,
        sold: item?.sold_out,
      });
    });

    const handleExportToPDF = () => {
      const doc = new jsPDF();
    
      const columns = ["Product Id", "Part Number", "Description", "Price", "Availability", "Warranty", "Supplier", "Category", "Brand"];
      const rows = data.map(row => [
        row.id,
        row.partNumber,
        row.name,
        selectedCurrency === "USD" ? `$${(row.price / row.shop.exchangeRate).toFixed(2)}` : `KES ${row.price}`,
        row.isAvailable ? "Available" : "Out of Stock",
        row.warranty,
        row.shop,
        row.category,
        row.brand,
      ]);
    
      doc.autoTable({
        head: [columns],
        body: rows,
      });
    
      doc.save('products.pdf');
    };

  return (
  <>
  {
    isLoading ? (
      <Loader />
    ) : (
      <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className="m-10 mt-5">
        <div className="w-full flex align-middle justify-center">
            <h1 className="font-bold text-center text-4xl">Products</h1>
            <hr />
          </div>
          {/* Breadcrumbs */}
          <div className="mb-4">
                <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, fontSize: "12px", color: "#000000ff" }}>
                  <li><a href="/">Home/</a></li>
                  {pathnames.map((name, index) => (
                    <li key={index}><a href={`/${name}`}>{name}</a></li>
                  ))}
                </ul>
          </div>
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
              // category: false,
              // brand: false,
            }}
            // disableColumnFilter
            disableDensitySelector
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                buttons: [
                  <Button
                    key="export-to-pdf"
                    variant="outlined"
                    color="primary"
                    onClick={handleExportToPDF}
                    style={{ marginLeft: '8px' }}
                  >
                    Download as PDF
                  </Button>,
                ],
              },
            }}
          />
      </div>
      <Footer />
    </div>
    )
  }
  </>
  );
};

export default ProductsPage;

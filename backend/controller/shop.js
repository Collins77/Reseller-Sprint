const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// create shop
router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const seller = {
      name: req.body.name,
      email,
      password: req.body.password,
      address: req.body.address,
      category: req.body.category,
      phoneNumber: req.body.phoneNumber,
      status: "Not approved", // Set the status to "Not approved" by default
    };

    const newSeller = await Shop.create(seller);
    const adminEmailOptions = {
      email: "support@afripixelsolutions.com", // Replace with your admin's email address
      subject: "New Seller Registration Notification",
      html: `<p>Hello Admin,</p>
             <p>A new seller has registered on your platform. Here are the details:</p>
             <ul>
               <li>Seller Name: ${newSeller.name}</li>
               <li>Email: ${newSeller.email}</li>
               <!-- Add any other relevant details you want to include -->
             </ul>
             <p>Thank you.</p>
             <p>Best regards,<br>[Your Company Name]</p>`
    };

    await sendMail(adminEmailOptions);

    res.status(201).json({
      success: true,
      message: "Registration successful, awaiting approval. Please expect a call/visit from us",
      user: newSeller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
}));

// Create seller account by admin
router.post(
  "/admin-create-seller",
  // isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;
      const sellerEmail = await Shop.findOne({ email });

      if (sellerEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const seller = {
        name: req.body.name,
        email,
        password: req.body.password,
        address: req.body.address,
        category: req.body.category,
        phoneNumber: req.body.phoneNumber,
        status: "Approved",
        role: "Seller",
      };

      const newSeller = await Shop.create(seller);

      const approvalEmailOptions = {
        email: newSeller.email,
        subject: "Account Creation and Approval Notification",
        html: `<p>Dear ${newSeller.name},</p>
               <p>We are pleased to inform you that your seller account has been created! Contact the support team to receive your credentials.</p>
               <p>Thank you for joining us.</p>
               <p>Best regards,<br>Reseller Sprint Team</p>
               <a href='https://opasso-frontend.vercel.app/shop-login'>Go to Login</a>`
      };

      await sendMail(approvalEmailOptions);

      res.status(201).json({
        success: true,
        message: "Seller account created by admin and approved.",
        seller: newSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      // Check if the user is approved before sending the token
      if (user.status !== "Approved") {
        return next(new ErrorHandler("Your account is not yet approved.", 401));
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
// router.put(
//   "/update-shop-avatar",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       let existsSeller = await Shop.findById(req.seller._id);

//         const imageId = existsSeller.avatar.public_id;

//         await cloudinary.v2.uploader.destroy(imageId);

//         const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//           folder: "avatars",
//           width: 150,
//         });

//         existsSeller.avatar = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };

  
//       await existsSeller.save();

//       res.status(200).json({
//         success: true,
//         seller:existsSeller,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, exchangeRate, address, phoneNumber } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.exchangeRate = exchangeRate;
      shop.address = address;
      shop.phoneNumber = phoneNumber;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update seller info by admin
router.put(
  "/admin-update-seller/:id",
  // isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, address, phoneNumber } = req.body;

      const seller = await Shop.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          address,
          // category,
          phoneNumber,
        },
        { new: true }
      );

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all sellers for user
router.get(
  "/get-all-sellers",
  // isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/approve-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    
    try {
      const seller = await Shop.findById(req.params.id);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      const approvedSeller = await Shop.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });;
            // Send account approval email
            const approvalEmailOptions = {
                email: approvedSeller.email,
                subject: "Account Approval Notification",
                html: `<p>Dear ${approvedSeller.name},</p>
                       <p>We are pleased to inform you that your seller account has been approved! You can now log in to your account and start using our platform.</p>
                       <p>Thank you for joining us.</p>
                       <p>Best regards,<br>Reseller Sprint Team</p>`
            };

            await sendMail(approvalEmailOptions);

      res.status(200).json({ message: "Seller approved", seller: approvedSeller });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

router.put("/reject-seller/:id", 
isAuthenticated, 
isAdmin("Admin"), 
async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Shop.findByIdAndUpdate(id, { status: "Rejected" }, { new: true });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller rejected", seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/on-hold-seller/:id", 
isAuthenticated, 
isAdmin("Admin"), 
async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Shop.findByIdAndUpdate(id, { status: "On Hold" }, { new: true });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller put on hold", seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

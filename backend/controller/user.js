const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create user
// router.post("/create-user", async (req, res, next) => {
//   try {
//     const { name, email, address, phoneNumber, password } = req.body;
//     const userEmail = await User.findOne({ email });

//     if (userEmail) {
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     const user = {
//       name: name,
//       email: email,
//       address: address, 
//       phoneNumber: phoneNumber, 
//       password: password,
//       status: "Not Approved",
//     };

//     // const activationToken = createActivationToken(user);

//     // const activationUrl = `https://opasso-frontend.vercel.app/activation/${activationToken}`;

//     try {
//       await sendMail({
//         email: user.email,
//         subject: "Account Approval",
//         message: `Hi ${user.name}, we have received your application to become a member of our platform. Your account is pending approval from our team. 
//         Kindly be patient as we process your application. 
//         You will be notified upon approval.`,
//         });
//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${user.email} for further instructions`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, address, phoneNumber, password } = req.body;

    // Check if the email already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Create a new user with status 'Not Approved'
    const newUser = new User({
      name,
      email,
      address,
      phoneNumber,
      password,
      status: "Not approved",
    });

    // Save the user to the database
    await newUser.save();

    // Send an email to the user
    await sendMail({
      email: newUser.email,
      subject: "Account Approval",
      message: `Hi ${newUser.name}, we have received your application to become a member of our platform. Your account is pending approval from our team. Kindly be patient as we process your application. You will be notified upon approval.`,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${newUser.email}) for further instructions.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


router.put(
  "/approve-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.status = "Approved";
      await user.save();
      // Send account approval email
      const approvalEmailOptions = {
        email: user.email,
        subject: "Account Approval Notification",
        html: `<p>Dear ${user.name},</p>
               <p>We are pleased to inform you that your account has been approved! You can now log in to your account and start using our platform.</p>
               <p>Thank you for joining us.</p>
               <p>Best regards,<br>Reseller Sprint Team</p>`
    };

    await sendMail(approvalEmailOptions);

      res.status(200).json({
        success: true,
        message: "User approved successfully!",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// create activation token
// const createActivationToken = (user) => {
//   return jwt.sign(user, process.env.ACTIVATION_SECRET, {
//     expiresIn: "7d",
//   });
// };

// activate user
// router.post(
//   "/activation",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { activation_token } = req.body;

//       const newUser = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET
//       );

//       if (!newUser) {
//         return next(new ErrorHandler("Invalid token", 400));
//       }
//       const { name, email, address, phoneNumber, password } = newUser;

//       let user = await User.findOne({ email });

//       if (user) {
//         return next(new ErrorHandler("User already exists", 400));
//       }
//       user = await User.create({
//         name,
//         email,
//         address,
//         phoneNumber,
//         password,
//       });

//       sendToken(user, 201, res);
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      if (user.status !== "Approved") {
        return next(new ErrorHandler("Your account is pending approval. You are not allowed to sign in.!", 401));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
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

// Approve User
router.put(
  "/approve-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.status = "Approved";
      await user.save();

      // Send account approval email
      const approvalEmailOptions = {
        email: user.email,
        subject: "Account Approval Notification",
        html: `<p>Dear ${user.name},</p>
               <p>We are pleased to inform you that your account has been approved! You can now log in to your account and start using our platform.</p>
               <p>Thank you for joining us.</p>
               <p>Best regards,<br>Your Platform Team</p>`,
      };

      await sendMail(approvalEmailOptions);

      res.status(200).json({
        success: true,
        message: "User approved successfully!",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Reject User
router.put(
  "/reject-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.status = "Rejected";
      await user.save();

      // Send account rejection email
      const rejectionEmailOptions = {
        email: user.email,
        subject: "Account Rejection Notification",
        html: `<p>Dear ${user.name},</p>
               <p>We regret to inform you that your account application has been rejected. If you have further questions, please contact our support team.</p>
               <p>Thank you for your understanding.</p>
               <p>Best regards,<br>Your Platform Team</p>`,
      };

      await sendMail(rejectionEmailOptions);

      res.status(200).json({
        success: true,
        message: "User rejected successfully!",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Put User on Hold
router.put(
  "/user-on-hold/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      user.status = "On Hold";
      await user.save();

      // Send account on-hold email
      const onHoldEmailOptions = {
        email: user.email,
        subject: "Account On Hold Notification",
        html: `<p>Dear ${user.name},</p>
               <p>Your account is currently on hold. If you have questions or concerns, please contact our support team for assistance.</p>
               <p>Thank you for your cooperation.</p>
               <p>Best regards,<br>Your Platform Team</p>`,
      };

      await sendMail(onHoldEmailOptions);

      res.status(200).json({
        success: true,
        message: "User put on hold successfully!",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;


// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name, address } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.address = address;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.address.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')
const User = require('../models/UserModel')
const HttpError = require("../models/errorModel")

//====================Register new USER
// POST : api/users/register

//UNPROTECTED
const registeredUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }
        const newEmail = email.toLowerCase()
        const EmailExists = await User.findOne({ email: newEmail })
        if (EmailExists) {
            return next(new HttpError("Email already Exists", 422))
        }



        if ((password.trim()).length < 6) {
            return next(new HttpError("password should be atleast 6 characters", 422))
        }

        if (password != password2) {
            return next(new HttpError("password do not match", 422))
        }


        const salt = await y
        bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass })
        res.status(201).json({ message: "User created successfully", user: newUser })

    } catch (error) {
        return next(new HttpError("User registration failed", 422))
    }
}














//====================LOGIN A Register new USER
// POST : api/users/login
//UNPROTECTED
// const loginUser = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return next(new HttpError("Fill in all fields.", 422))
//         }
//         const newEmail = email.toLowerCase();

//         const user = await User.findOne({ email: newEmail })
//         if (!user) {
//             return next(new HttpError("Invalid credentials.", 422))
//         }

//         const comparePass = await bcrypt.compare(password, user.password)
//         if (!comparePass) {
//             return next(new HttpError("You have entered a wrong password", 422))
//         }

//         const { id: id, name } = user;
//         const token = jwt.sign({ id, name },process.env.JWT_SECRET, { expiresIn: "1d" })
//         res.status(200).json({ token, id, name })

//     } catch (error) {
//         return next(new HttpError("Login Failed. Please check your credentials  FUCK OFFFF.", 422))
//     }
// }

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail });
        if (!user) {
            return next(new HttpError("Invalid credentials get the STFU.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError("You have entered the wrong password.", 422));
        }

        const { id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, id, name });

    } catch (err) {
        return next(new HttpError("Login Failed. Please check your credentials.", 500));
    }
};
















//====================USER PROFILE
// GET : api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError("User Not Found.", 422));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError("Fetching user failed. Please try again later.", 500));
    }
};














//====================CHANGE USER AVATAR (PROFILE Picture)
// POST : api/users/change-avatar
//PROTECTED
// const chnageAvatar = async (req, res, next) => {
//     try {
//         if (!req.files.avatar) {
//             return next(new HttpError("Please choose an image", 422))
//         }

//         //find user avatar from db
//         const user = await User.findById(req.user.id)
//         if (user.avatar) {
//             fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
//                 if (err) {
//                     return next(new HttpError(err))
//                 }
//             })
//         }

//         const { avatar } = req.files;
//         if (avatar.size > 500000) {
//             return next(new HttpError("Profile picture too big .should be less than 500kb"), 422)
//         }

//         let filename;
//         filename = avatar.name;
//         let splittedFilename = filename.split(".")
//         let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
//         avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
//             if (err) {
//                 return next(new HttpError(err))
//             }

//             const updaredAvatar = await User.findById(req.user.id, { avatar: newFilename }, { new: true })
//             if (!updaredAvatar) {
//                 return next(new HttpError("Avatar couldn't be chnaged"), 422)
//             }

//             res.status(200).json(updaredAvatar)
//         })
//     } catch (error) {
//         return next(new HttpError(error))
//     }
// }

// const changeAvatar = async (req, res, next) => {
//     try {
//         if (!req.files || !req.files.avatar) {
//             return next(new HttpError("Please choose an image", 422));
//         }

//         // Find user avatar from db
//         const user = await User.findById(req.user.id);
//         if (user.avatar) {
//             fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
//                 if (err) {
//                     return next(new HttpError("Failed to delete old avatar", 500));
//                 }
//             });
//         }

//         const { avatar } = req.files;
//         if (avatar.size > 500000) {
//             return next(new HttpError("Profile picture too big. Should be less than 500kb", 422));
//         }

//         const filename = avatar.name;
//         const splittedFilename = filename.split(".");
//         const newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1];

//         avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
//             if (err) {
//                 return next(err);
//             }

//             const updatedAvatar = await User.findByIdAndUpdate(
//                 req.user.id,
//                 { avatar: newFilename },
//                 { new: true }
//             );

//             if (!updatedAvatar) {
//                 return next(new HttpError("Avatar couldn't be changed", 422));
//             }

//             res.status(200).json(updatedAvatar);
//         });
//     } catch (error) {
//         return next(new HttpError("Something went wrong, please try again", 500));
//     }
// };

const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image", 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        // Delete the old avatar if it exists
        if (user.avatar) {
            const oldAvatarPath = path.join(__dirname, '..', 'uploads', user.avatar);
            fs.unlink(oldAvatarPath, (err) => {
                if (err) {
                    console.error("Failed to delete old avatar:", err);
                    // Don't throw an error here; just log it. We still want to continue.
                }
            });
        }

        const { avatar } = req.files;
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb", 422));
        }

        // Generate a new filename for the avatar
        const ext = path.extname(avatar.name);
        const newFilename = `${path.basename(avatar.name, ext)}-${uuid()}${ext}`;

        // Save the new avatar file
        const uploadPath = path.join(__dirname, '..', 'uploads', newFilename);
        avatar.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError("Failed to save the new avatar", 500));
            }

            // Update the user with the new avatar path
            user.avatar = newFilename;
            await user.save();

            // Respond with the new avatar path
            res.status(200).json({ avatar: newFilename });
        });
    } catch (error) {
        console.error("Something went wrong:", error);
        return next(new HttpError("Something went wrong, please try again", 500));
    }
};











//====================EDIT USER DETAILS (from profiles)
// POST : api/users/edit-user
//PROTECTED
// const EditUser = async (req, res, next) => {
//     try {
//         const { name, email, currentPassword, newPassword, NewconfirmPassword } = req.body;
//         if (!name || !email || !currentPassword || !newPassword) {
//             return next(new HttpError("Fill in all Fields"), 422);
//         }

//         //get user from databse
//         const user = await User.findById(req.user.id)
//         if (!user) {
//             return next(new HttpError("User not found", 403))
//         }

//         //make sure new email doesn't already exists
//         const EmailExists = await User.findOne({ email });
//         if (EmailExists && (EmailExists._id != req.user.id)) {
//             return next(new HttpError("Email Already Exists", 422))
//         }

//         //comapre current pwd to databse pw

//         const validatepwd = await bcrypt.compare(currentPassword, user.password)
//         if (!validatepwd) {
//             return next(new HttpError("Invalid current password", 422))
//         }

//         if (newPassword !== NewconfirmPassword) {
//             return next(new HttpError("New Passwords do not match.", 422))
//         }

//         const salt = await bcrypt.genSalt(10)
//         const Hash = await bcrypt.hash(newPassword, salt);


//         const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: Hash }, { new: true });
//         res.status(200).json(newInfo)
//     } catch (err) {
//         return next(new HttpError("Something went wrong in details, please try again", 500));
//     }
// }
const EditUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, NewconfirmPassword } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !currentPassword) {
            return next(new HttpError("Please fill in all required fields.", 422));
        }

        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found.", 403));
        }

        // Ensure the new email does not already exist for another user
        const EmailExists = await User.findOne({ email });
        if (EmailExists && EmailExists._id.toString() !== req.user.id) {
            return next(new HttpError("Email already exists.", 422));
        }

        // Compare current password with the one in the database
        const validatePwd = await bcrypt.compare(currentPassword, user.password);
        if (!validatePwd) {
            return next(new HttpError("Invalid current password.", 422));
        }

        // Handle password change if new passwords are provided
        let updatedPassword = user.password;
        if (newPassword || NewconfirmPassword) {
            if (newPassword !== NewconfirmPassword) {
                return next(new HttpError("New passwords do not match.", 422));
            }

            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(newPassword, salt);
        }

        // Update the user's information
        user.name = name;
        user.email = email;
        user.password = updatedPassword;

        // Save the updated user info
        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
        });
    } catch (err) {
        return next(new HttpError("Something went wrong, please try again.", 500));
    }
};


//====================GET USERS
// POST : api/users/authors
//PROTECTED
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    }
    catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = { registeredUser, loginUser, getAuthors, getUser, EditUser, changeAvatar }

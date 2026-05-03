import User from "../models/User.js";
import bcrypt from "bcrypt";
import { UserInput } from "../validations/user.validation.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const fetchAllUsers = async (search?: string, page: number = 1, limit: number = 10) => {

    const query: any = {  };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    const total = await User.countDocuments(query);
    const skip = (page - 1) * limit;
    
    const users = await User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const fetchUserById = async (userId: string) => {

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage ?? ""
    }
}

const updateUserById = async (userId: string, data: UserInput, file?: Express.Multer.File) => {

    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;

    if (data.password !== undefined) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        user.password = hashedPassword;
    }

    if (file) {
        const imageUrl = await uploadToCloudinary(file.buffer, file.mimetype);
        user.profileImage = imageUrl;
    }

    await user.save();

    return user;
} 

const uploadToCloudinary = (buffer: Buffer, mimetype: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "notes-app/avatars", // organized folder in cloudinary
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url); // returns https cloudinary URL
      }
    );

    // Convert buffer to stream and pipe to cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export default {
    fetchAllUsers,
    fetchUserById,
    updateUserById,
};
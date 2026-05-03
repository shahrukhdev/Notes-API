import mongoose, {Schema, Document} from "mongoose";

export interface CategoryInterface extends Document {

    title: string,
    user?: mongoose.Types.ObjectId,
}

const categorySchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
            index: true
        }
    },
    { timestamps: true }
);

const Category = mongoose.model<CategoryInterface>("Category", categorySchema);

export default Category;

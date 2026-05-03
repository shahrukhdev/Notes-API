import mongoose, {Schema, Document} from "mongoose";

export interface TagInterface extends Document {

    name: string,
    slug: string,
    user?: mongoose.Types.ObjectId,
    isActive: boolean
}

const tagSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
            index: true
        },
        isActive: {
            type: Boolean,
            default: false,
            index: true
        },
    },
    { timestamps: true }
);

const Tag = mongoose.model<TagInterface>("Tag", tagSchema);

export default Tag;

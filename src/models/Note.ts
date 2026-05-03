import mongoose, {Schema, Document} from "mongoose";

export interface NoteInterface extends Document {

    title: string,
    content: string,
    user: mongoose.Types.ObjectId,
    category?: mongoose.Types.ObjectId,
    tagIds?: mongoose.Types.ObjectId[],
    isPinned: boolean,
    isArchived: boolean,
};

const noteSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: false,
            index: true
        },
        tagIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Tag"
                }
            ],
            default: []
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

const Note = mongoose.model<NoteInterface>("Note", noteSchema);

export default Note;

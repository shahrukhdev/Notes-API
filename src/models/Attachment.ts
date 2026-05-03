import mongoose, {Schema, Document} from "mongoose";

export interface AttachmentInterface extends Document {

    note: mongoose.Types.ObjectId,
    user?: mongoose.Types.ObjectId,
    fileName: string,
    fileUrl: string,
    fileExtension?: string,
    fileType?: string,
    size: number
}

const attachmentSchema: Schema = new Schema(
    {
        note: {
            type: Schema.Types.ObjectId,
            ref: "Note",
            required: true,
            index: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
            index: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        fileExtension: {
            type: String,
            required: false
        },
        fileType: {
            type: String,
            required: false
        },
        size: {
            type: Number,
            required: false
        }
    },
    { timestamps: true }
);

const Attachment = mongoose.model<AttachmentInterface>("Attachment", attachmentSchema);

export default Attachment;

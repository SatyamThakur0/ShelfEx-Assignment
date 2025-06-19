import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X, ImageIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { postActions } from "@/store/postSlice";

const CreatePostDialog = ({ open, setOpen }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePost = async () => {
        try {
            if (!caption.trim()) {
                setIsPosting(false);
                toast.warning("Caption Required");
                return;
            }

            setIsPosting(true);

            // You would typically upload to your backend here
            console.log("Post created:", { image: selectedImage, caption });
            const formData = new FormData();
            formData.append("caption", caption);
            formData.append("image", selectedImage);

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/posts/create`,
                {
                    method: "post",
                    credentials: "include",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.ok) {
                setSelectedImage(null);
                setImagePreview(null);
                setCaption("");
                setIsPosting(false);
                setOpen(false);
                dispatch(postActions.addPost(data.post));
            }
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const resetForm = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setCaption("");
        setIsPosting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={() => {
                    resetForm();
                }}
                className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
            >
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                        Create New Post
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-3">
                        <Label
                            htmlFor="image-upload"
                            className="text-sm font-medium"
                        >
                            Add Image
                        </Label>

                        {!imagePreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm sm:text-base font-medium text-gray-700">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        Choose File
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 sm:h-64 md:h-72 object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 w-8 h-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                        />
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-3">
                        <Label
                            htmlFor="caption"
                            className="text-sm font-medium"
                        >
                            What's on your mind?
                        </Label>
                        <Textarea
                            id="caption"
                            placeholder="Share your thoughts, ideas, or experiences..."
                            value={caption}
                            required
                            onChange={(e) => setCaption(e.target.value)}
                            className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                            <span>Share your thoughts or add an image</span>
                            <span>{caption.length}/500</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                            className="w-full sm:w-auto text-sm sm:text-base"
                            disabled={isPosting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePost}
                            disabled={
                                (!selectedImage && !caption.trim()) || isPosting
                            }
                            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                        >
                            {isPosting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Posting...
                                </div>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;

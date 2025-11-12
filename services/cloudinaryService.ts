const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME; // Replace with yours
const CLOUDINARY_UPLOAD_PRESET =
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_UPLOAD_PRESET; // Create this in Cloudinary dashboard

const cloudinaryService = {
    /**
     * @param imageUri - Local file URI from image picker
     * @returns Image URL from Cloudinary
     */
    async uploadImage(
        imageUri: string
    ): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            // Create form data
            const formData = new FormData();

            // Add the image file
            formData.append("file", {
                uri: imageUri,
                type: "image/jpeg",
                name: "upload.jpg",
            } as any);

            // Add upload preset (unsigned upload)
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.secure_url) {
                return {
                    success: true,
                    url: data.secure_url, // This is your image URL
                };
            } else {
                return {
                    success: false,
                    error: data.error?.message || "Upload failed",
                };
            }
        } catch (error: any) {
            console.error("Cloudinary upload error:", error);
            return {
                success: false,
                error: error.message || "Upload failed",
            };
        }
    },

    /**
     * Get optimized image URL
     * Use this to display images efficiently
     */
    getOptimizedUrl(
        url: string,
        width: number = 400,
        quality: number = 80
    ): string {
        if (!url.includes("cloudinary.com")) return url;

        // Insert transformation parameters
        return url.replace(
            "/upload/",
            `/upload/w_${width},q_${quality},f_auto/`
        );
    },

    /**
     * Get thumbnail URL
     */
    getThumbnailUrl(url: string): string {
        return this.getOptimizedUrl(url, 150, 70);
    },
};

export default cloudinaryService;

const supabase = require('./db');
const fs = require('fs');

async function uploadImage(file) {
    try {
        if (!file || !file.filepath) {
            throw new Error('Image is required and must be a valid file');
        }

        const fileBuffer = fs.readFileSync(file.filepath);
        const fileExt = file.originalFilename.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        console.log(`Uploading file: ${fileName}`);

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('agritayoimages')
            .upload(fileName, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype,
            });

        if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from('agritayoimages')
            .getPublicUrl(uploadData.path);

        console.log(`Image successfully uploaded: ${fileName}`);
        console.log(`Generated public URL: ${publicUrlData.publicUrl}`);

        return publicUrlData.publicUrl;
    } catch (error) {
        throw new Error(`Image upload error: ${error.message}`);
    }
}

async function deleteImage(imageUrl) {
    try {
        if (!imageUrl) {
            console.log('No image URL provided');
            return;
        }

        const imagePath = imageUrl.split('/storage/v1/object/public/agritayoimages/')[1];

        console.log(`Deleting image with path: ${imagePath}`);

        const { error: deleteImageError } = await supabase
            .storage
            .from('agritayoimages')
            .remove([imagePath]);

        if (deleteImageError) {
            throw new Error(`Failed to delete image from storage: ${deleteImageError.message}`);
        }

        console.log('Image successfully deleted from storage');
    } catch (error) {
        throw new Error(`Image delete error: ${error.message}`);
    }
}

module.exports = {
    uploadImage,
    deleteImage,
};

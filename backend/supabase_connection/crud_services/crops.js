// supabase_connection/crops.js
const supabase = require("../db");
const formidable = require("formidable");
const imageHandler = require("../imageHandler");

async function getCrops(req, res) {
  try {
    const { data, error } = await supabase.from("crops").select("*");

    if (error) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(data);
  } catch (err) {
    console.error("Error executing Supabase query:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addCrop(req, res) {
  try {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      const {
        crop_name,
        crop_description,
        crop_category_id,
        sub_category_id,
        crop_size_id,
        crop_variety_id,
        shop_id,
        crop_rating,
        crop_price,
        crop_quantity,
        crop_weight,
        metric_system_id,
        crop_class,
        crop_availability,
        negotiation_allowed,
        minimum_negotiation
      } = fields;

      const getSingleValue = (value) =>
        Array.isArray(value) ? value[0] : value;

      const cropCategoryId = parseInt(getSingleValue(crop_category_id), 10);
      const cropSizeId = parseInt(getSingleValue(crop_size_id), 10);
      const cropVarietyId = parseInt(getSingleValue(crop_variety_id), 10);
      const subCategoryId = parseInt(getSingleValue(sub_category_id), 10);
      const shopId = parseInt(getSingleValue(shop_id), 10);
      const cropRating = parseFloat(getSingleValue(crop_rating), 10);
      const cropPrice = parseFloat(getSingleValue(crop_price), 10);
      const cropQuantity = parseInt(getSingleValue(crop_quantity), 10);
      const minimumNegotiation = parseInt(getSingleValue(minimum_negotiation), 10);
      const cropWeight = parseInt(getSingleValue(crop_weight), 10);
      const metricSystemId = parseInt(getSingleValue(metric_system_id), 10);

      const crop_image_file = files.crop_image ? files.crop_image[0] : null;

      const image = files.image ? files.image[0] : null;

      let crop_image_url = null;

      if (image) {
        try {
          crop_image_url = await imageHandler.uploadImage(image);
          console.log("Image uploaded successfully, URL:", crop_image_url);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError.message);
          return res.status(500).json({ error: "Image upload failed" });
        }
      }

      const { data, error } = await supabase.from("crops").insert([
        {
          crop_name: getSingleValue(crop_name),
          crop_description: getSingleValue(crop_description),
          crop_class: getSingleValue(crop_class),
          availability: getSingleValue(crop_availability),
          sub_category_id: getSingleValue(subCategoryId),
          category_id: getSingleValue(cropCategoryId),
          crop_size_id: getSingleValue(cropSizeId),
          crop_variety_id: getSingleValue(cropVarietyId),
          shop_id: getSingleValue(shopId),
          crop_rating: getSingleValue(cropRating),
          crop_price: getSingleValue(cropPrice),
          crop_quantity: getSingleValue(cropQuantity),
          crop_weight: getSingleValue(cropWeight),
          metric_system_id: getSingleValue(metricSystemId),
          negotiation_allowed: getSingleValue(negotiation_allowed),
          minimum_negotiation: getSingleValue(minimumNegotiation),
          crop_image_url,
        },
      ]);

      if (error) {
        console.error("Supabase query failed:", error.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "Crop added successfully", data });
    });
  } catch (err) {
    console.error("Unexpected error during addCrop execution:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateCrop(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required for update" });
    }

    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      const {
        crop_name,
        crop_description,
        crop_category_id,
        sub_category_id,
        crop_size_id,
        crop_variety_id,
        shop_id,
        crop_rating,
        crop_price,
        crop_quantity,
        crop_weight,
        metric_system_id,
        crop_class,
        crop_availability,
        negotiation_allowed,
        minimum_negotiation
      } = fields;

      const new_image_file = files.crop_image ? files.crop_image[0] : null;

      // Fetch current crop data to get the existing image URL
      const { data: existingData, error: fetchError } = await supabase
        .from("crops")
        .select("crop_image_url")
        .eq("crop_id", id)
        .single();

      if (fetchError) {
        console.error("Failed to fetch existing crop:", fetchError.message);
        return res.status(500).json({ error: "Failed to fetch existing crop" });
      }

      const existingImageUrl = existingData.crop_image_url;
      let crop_image_url = existingImageUrl;

      // Handle image upload and deletion of the existing image
      if (new_image_file) {
        console.log("Received new image file for update:", new_image_file);

        // Delete old image if it exists
        if (existingImageUrl) {
          console.log("Deleting existing image:", existingImageUrl);
          try {
            await imageHandler.deleteImage(existingImageUrl);
            console.log("Existing image successfully deleted");
          } catch (deleteError) {
            console.error(
              "Failed to delete existing image:",
              deleteError.message
            );
            return res.status(500).json({ error: "Failed to delete image" });
          }
        }

        // Upload the new image
        try {
          crop_image_url = await imageHandler.uploadImage(new_image_file);
          console.log("New image uploaded successfully, URL:", crop_image_url);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError.message);
          return res.status(500).json({ error: "Image upload failed" });
        }
      }

      const getSingleValue = (value) =>
        Array.isArray(value) ? value[0] : value;

      // Prepare the update data
      const updateData = {
        crop_name: getSingleValue(crop_name),
        crop_description: getSingleValue(crop_description),
        sub_category_id: parseInt(sub_category_id, 10),
        category_id: parseInt(crop_category_id, 10),
        shop_id: parseInt(shop_id, 10),
        crop_size_id: parseInt(crop_size_id, 10),
        crop_variety_id: parseInt(crop_variety_id, 10),
        crop_rating: parseFloat(crop_rating, 10),
        crop_price: parseFloat(crop_price, 10),
        crop_quantity: parseInt(crop_quantity, 10),
        crop_weight: parseInt(crop_weight, 10),
        crop_class: getSingleValue(crop_class),
        availability: getSingleValue(crop_availability),
        metric_system_id: parseInt(metric_system_id, 10),
        minimum_negotiation: parseInt(minimum_negotiation, 10),
        negotiation_allowed: getSingleValue(negotiation_allowed),
        crop_image_url, // Only set if a new image is uploaded
      };

      // Update the crop in the database
      const { data, error } = await supabase
        .from("crops")
        .update(updateData)
        .eq("crop_id", id);

      if (error) {
        console.error("Supabase query failed:", error.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Successful update
      res.status(200).json({ message: "Crop updated successfully", data });
    });
  } catch (err) {
    console.error("Error executing updateCrop process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateCropAvailability(req, res) {
    try {
        const { id } = req.params;
        const { availability, availability_message } = req.body;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        if (availability === undefined || availability_message === undefined) {
            return res.status(400).json({ error: 'Availability and availability_message are required' });
        }

        const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;
        
        // Prepare the update data
        const updateData = {
            availability: getSingleValue(availability),
            availability_message: getSingleValue(availability_message)
        };

        // Update the crop in the database
        const { data, error } = await supabase
            .from('crops')
            .update(updateData)
            .eq('crop_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Successful update
        res.status(200).json({ message: 'Crop availability updated successfully', data });
    } catch (err) {
        console.error('Error executing updateCropAvailability process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCrop(req, res) {
  try {
    const { id } = req.params;

    // Fetch existing crop data including image URL
    const { data: existingData, error: fetchError } = await supabase
      .from("crops")
      .select("crop_image_url")
      .eq("crop_id", id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch crop:", fetchError.message);
      return res.status(500).json({ error: "Failed to fetch crop" });
    }

    const cropImageUrl = existingData.crop_image_url;

    // Delete the image
    if (cropImageUrl) {
      await imageHandler.deleteImage(cropImageUrl);
    }

    // Delete the crop from the database
    const { data, error } = await supabase
      .from("crops")
      .delete()
      .eq("crop_id", id);

    if (error) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ message: "Crop deleted successfully", data });
  } catch (err) {
    console.error("Error executing deleteCrop process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
    getCrops,
    addCrop,
    updateCrop,
    updateCropAvailability,
    deleteCrop
};

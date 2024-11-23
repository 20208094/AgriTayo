const supabase = require("../db");
const formidable = require("formidable");
const imageHandler = require("../imageHandler");

async function getCropCategories(req, res) {
  try {
    const { data, error } = await supabase.from("crop_category").select("*");

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

async function addCropCategory(req, res) {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      console.log("Fields:", fields);
      console.log("Files:", files);

      const crop_category_name = fields.crop_category_name[0];
      const crop_category_description = fields.crop_category_description[0];
      const image = files.image ? files.image[0] : null;

      let crop_category_image_url = null;

      if (image) {
        try {
          crop_category_image_url = await imageHandler.uploadImage(image);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError.message);
          return res.status(500).json({ error: "Image upload failed" });
        }
      }

      try {
        const { data, error } = await supabase.from("crop_category").insert([
          {
            crop_category_name,
            crop_category_description,
            crop_category_image_url,
          },
        ]);

        if (error) {
          console.error("Supabase query failed:", error.message);
          return res.status(500).json({ error: "Internal server error" });
        }

        res
          .status(201)
          .json({ message: "Crop category added successfully", data });
      } catch (err) {
        console.error("Error executing Supabase query:", err.message);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (err) {
    console.error("Error executing Supabase query:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateCropCategory(req, res) {
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

      const crop_category_name = Array.isArray(fields.crop_category_name)
        ? fields.crop_category_name[0]
        : fields.crop_category_name;
      const crop_category_description = Array.isArray(
        fields.crop_category_description
      )
        ? fields.crop_category_description[0]
        : fields.crop_category_description;
      const newImage = files.image ? files.image[0] : null;

      try {
        // Fetch existing data
        const { data: existingData, error: fetchError } = await supabase
          .from("crop_category")
          .select("crop_category_image_url")
          .eq("crop_category_id", id)
          .single();

        if (fetchError) {
          console.error("Failed to fetch crop category:", fetchError.message);
          return res
            .status(500)
            .json({ error: "Failed to fetch crop category" });
        }

        const existingImageUrl = existingData.crop_category_image_url;

        // Delete existing image if necessary
        await imageHandler.deleteImage(existingImageUrl);

        let crop_category_image_url = existingImageUrl;
        if (newImage) {
          crop_category_image_url = await imageHandler.uploadImage(newImage);
        }

        // Update crop category in database
        const { data, error: updateError } = await supabase
          .from("crop_category")
          .update({
            crop_category_name,
            crop_category_description,
            crop_category_image_url,
          })
          .eq("crop_category_id", id);

        if (updateError) {
          console.error("Failed to update crop category:", updateError.message);
          return res
            .status(500)
            .json({ error: "Failed to update crop category" });
        }

        res
          .status(200)
          .json({ message: "Crop category updated successfully", data });
      } catch (error) {
        console.error("Error processing update:", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (err) {
    console.error("Error executing update process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteCropCategory(req, res) {
  try {
    const { id } = req.params;

    const { data: cropCategoryData, error: fetchError } = await supabase
      .from("crop_category")
      .select("crop_category_image_url")
      .eq("crop_category_id", id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch crop category:", fetchError.message);
      return res.status(500).json({ error: "Failed to fetch crop category" });
    }

    const imageUrl = cropCategoryData.crop_category_image_url;

    await imageHandler.deleteImage(imageUrl);

    const { data, error: deleteError } = await supabase
      .from("crop_category")
      .delete()
      .eq("crop_category_id", id);

    if (deleteError) {
      console.error(
        "Failed to delete crop category from database:",
        deleteError.message
      );
      return res
        .status(500)
        .json({ error: "Failed to delete crop category from database" });
    }

    res
      .status(200)
      .json({ message: "Crop category deleted successfully", data });
  } catch (err) {
    console.error("Error executing deletion process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addCropCategoryApp(req, res) {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      let crop_category_image_url = null;
      let crop_sub_category_image_url = null;
      let crop_variety_image_url = null;

      try {
        // Parse form fields and upload images
        const crop_category_name = fields.crop_category_name[0];
        const crop_category_description = fields.crop_category_description[0];
        const image = files.image ? files.image[0] : null;

        if (image) {
          try {
            crop_category_image_url = await imageHandler.uploadImage(image);
          } catch (uploadError) {
            console.error("Image upload error:", uploadError.message);
            return res.status(500).json({ error: "Image upload failed" });
          }
        }

        console.log(
          "Category Data: ",
          crop_category_name,
          crop_category_description,
          crop_category_image_url
        );
        const { data: categoryData, error: categoryError } = await supabase
          .from("crop_category")
          .insert([
            {
              crop_category_name,
              crop_category_description,
              crop_category_image_url,
            },
          ])
          .select()
          .single();

        console.log("Category Insert Data:", categoryData);
        console.log("Category Insert Error:", categoryError);

        if (categoryError)
          throw new Error(
            `Failed to add crop category: ${categoryError.message}`
          );

        const crop_category_id = categoryData.crop_category_id;
        console.log("Inserted Crop Category ID:", crop_category_id);

        // Add crop sub-category
        const crop_sub_category_name = Array.isArray(
          fields.crop_sub_category_name
        )
          ? fields.crop_sub_category_name[0]
          : null;

        const crop_sub_category_description = Array.isArray(
          fields.crop_sub_category_description
        )
          ? fields.crop_sub_category_description[0]
          : null;
        const subImage = files.image ? files.image[0] : null;

        if (subImage) {
          try {
            crop_sub_category_image_url = await imageHandler.uploadImage(
              subImage
            );
          } catch (uploadError) {
            console.error("Image upload error:", uploadError.message);
            return res.status(500).json({ error: "Image upload failed" });
          }
        }

        console.log(
          "Sub Category Data: ",
          crop_sub_category_name,
          crop_sub_category_description,
          crop_category_id,
          crop_sub_category_image_url
        );
        const { data: categorySubData, error: subCategoryError } =
          await supabase
            .from("crop_sub_category")
            .insert([
              {
                crop_sub_category_name,
                crop_sub_category_description,
                crop_sub_category_image_url,
                crop_category_id,
              },
            ])
            .select()
            .single();

        console.log("Sub-Category Insert Data:", categorySubData);
        console.log("Sub-Category Insert Error:", subCategoryError);

        if (subCategoryError)
          throw new Error(
            `Failed to add crop sub-category: ${subCategoryError.message}`
          );

        const crop_sub_category_id = categorySubData.crop_sub_category_id;

        // Add crop variety
        const crop_variety_name = Array.isArray(fields.crop_variety_name)
          ? fields.crop_variety_name[0]
          : null;
        const crop_variety_description = Array.isArray(
          fields.crop_variety_description
        )
          ? fields.crop_variety_description[0]
          : null;
        const varImage = files.image ? files.image[0] : null;

        if (varImage) {
          try {
            crop_variety_image_url = await imageHandler.uploadImage(varImage);
          } catch (uploadError) {
            console.error("Image upload error:", uploadError.message);
            return res.status(500).json({ error: "Image upload failed" });
          }
        }

        console.log(
          "Crop Variety Data: ",
          crop_variety_name,
          crop_variety_description,
          crop_variety_image_url,
          crop_category_id,
          crop_sub_category_id
        );
        const { varietyError } = await supabase
          .from("crop_varieties")
          .insert([
            {
              crop_variety_name,
              crop_variety_description,
              crop_variety_image_url,
              crop_category_id,
              crop_sub_category_id,
            },
          ])
          .select()
          .single();

        if (varietyError)
          throw new Error(
            `Failed to add crop variety: ${varietyError.message}`
          );

        // Respond with success
        res.status(201).json({
          message:
            "Crop category, sub-category, and variety added successfully",
        });
      } catch (error) {
        console.error("Error during crop variety addition:", error.message);

        res.status(500).json({ error: error.message });
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getCropCategories,
  addCropCategory,
  updateCropCategory,
  deleteCropCategory,
  addCropCategoryApp,
};

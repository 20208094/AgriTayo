const supabase = require('../db');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const imageHandler = require('../imageHandler'); // Utility module to handle image uploads

async function getUsers(req, res) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(data);
    } catch (err) {
        console.error('Error executing Supabase query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addUser(req, res) {
    try {
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const { firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified } = fields;
            const user_image_file = files.user_image ? files.user_image[0] : null;

            // Hash the password before inserting it
            const hashedPassword = await bcrypt.hash(password, 10);

            let user_image_url = null;
            if (user_image_file) {
                try {
                    user_image_url = await imageHandler.uploadImage(user_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('users')
                .insert([{
                    firstname,
                    middlename,
                    lastname,
                    email,
                    password: hashedPassword,
                    phone_number,
                    gender,
                    birthday,
                    user_type_id,
                    verified,
                    user_image_url
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(201).json({ message: 'User added successfully', data });
        });
    } catch (err) {
        console.error('Error executing addUser process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const { firstname, middlename, lastname, email, password, phone_number, gender, birthday, user_type_id, verified } = fields;
            const new_image_file = files.user_image ? files.user_image[0] : null;

            // Fetch the current user data
            const { data: currentUser, error: fetchError } = await supabase
                .from('users')
                .select('password, user_image_url')
                .eq('user_id', id)
                .single();

            if (fetchError) {
                console.error('Failed to fetch current user data:', fetchError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const currentPasswordHash = currentUser.password;
            const existingImageUrl = currentUser.user_image_url;

            let user_image_url = null;
            if (new_image_file) {
                // Delete old image if it exists
                if (existingImageUrl) {
                    await imageHandler.deleteImage(existingImageUrl);
                }

                // Upload new image
                try {
                    user_image_url = await imageHandler.uploadImage(new_image_file);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            // Prepare data to be updated
            const updateData = {
                firstname,
                middlename,
                lastname,
                email,
                phone_number,
                gender,
                birthday,
                user_type_id,
                verified,
                user_image_url: user_image_url || existingImageUrl // Use existing image URL if no new image provided
            };

            // Check if the password field is provided and needs to be hashed
            if (password && password !== currentPasswordHash) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('user_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ message: 'User updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateUser process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        // Fetch existing user data including image URL
        const { data: existingData, error: fetchError } = await supabase
            .from('users')
            .select('user_image_url')
            .eq('user_id', id)
            .single();

        if (fetchError) {
            console.error('Failed to fetch user:', fetchError.message);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        const userImageUrl = existingData.user_image_url;

        // Delete the image
        if (userImageUrl) {
            await imageHandler.deleteImage(userImageUrl);
        }

        // Delete the user from the database
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ message: 'User deleted successfully', data });
    } catch (err) {
        console.error('Error executing deleteUser process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};

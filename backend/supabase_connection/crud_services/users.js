const supabase = require('../db');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const imageHandler = require('../imageHandler');

async function getUsers(req, res) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // console.log('Retrieved users data:', data);
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

            // Extract fields and files, ensuring single values
            const {
                firstname,
                middlename,
                lastname,
                email,
                password,
                phone_number,
                gender,
                birthday,
                user_type_id,
                verified
            } = fields;

            // Convert array to string if necessary
            const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;

            const userTypeId = parseInt(getSingleValue(user_type_id), 10);
            if (isNaN(userTypeId)) return res.status(400).json({ error: 'Invalid user_type_id' });

            const allowedGenders = ['Male', 'Female', 'Other'];
            const genderValue = getSingleValue(gender);
            if (!allowedGenders.includes(genderValue)) return res.status(400).json({ error: 'Invalid gender value' });

            const passwordString = getSingleValue(password);
            if (typeof passwordString !== 'string') return res.status(400).json({ error: 'Invalid password type' });

            const verifiedBoolean = getSingleValue(verified) === 'true';

            // Hash the password
            const hashedPassword = await bcrypt.hash(passwordString, 10);

            const image = files.image ? files.image[0] : null;

            let user_image_url = null;

            if (image) {
                console.log('Received image file for upload:', image);
                try {
                    user_image_url = await imageHandler.uploadImage(image);
                    console.log('Image uploaded successfully, URL:', user_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const { data, error } = await supabase
                .from('users')
                .insert([{
                    firstname: getSingleValue(firstname),
                    middlename: getSingleValue(middlename),
                    lastname: getSingleValue(lastname),
                    email: getSingleValue(email),
                    password: hashedPassword,
                    phone_number: getSingleValue(phone_number),
                    gender: genderValue,
                    birthday: getSingleValue(birthday),
                    user_type_id: userTypeId,
                    verified: verifiedBoolean,
                    user_image_url
                }]);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log('User added successfully:', data);
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

        if (!id) {
            return res.status(400).json({ error: 'ID is required for update' });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const {
                firstname,
                middlename,
                lastname,
                email,
                password,
                phone_number,
                gender,
                birthday,
                user_type_id,
                verified
            } = fields;

            const newImageFile = files.image ? files.image[0] : null;

            const userTypeId = parseInt(getSingleValue(user_type_id), 10);
            if (isNaN(userTypeId)) return res.status(400).json({ error: 'Invalid user_type_id' });

            const allowedGenders = ['Male', 'Female', 'Other'];
            const genderValue = getSingleValue(gender);
            if (genderValue && !allowedGenders.includes(genderValue)) return res.status(400).json({ error: 'Invalid gender value' });

            const passwordString = getSingleValue(password);
            if (passwordString && typeof passwordString !== 'string') return res.status(400).json({ error: 'Invalid password type' });

            const verifiedBoolean = getSingleValue(verified) === 'true';

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

            let user_image_url = existingImageUrl;
            if (newImageFile) {
                console.log('Received new image file for update:', newImageFile);

                if (existingImageUrl) {
                    console.log('Deleting existing image:', existingImageUrl);
                    try {
                        await imageHandler.deleteImage(existingImageUrl);
                        console.log('Existing image successfully deleted');
                    } catch (deleteError) {
                        console.error('Failed to delete existing image:', deleteError.message);
                        return res.status(500).json({ error: 'Failed to delete image' });
                    }
                }

                try {
                    user_image_url = await imageHandler.uploadImage(newImageFile);
                    console.log('New image uploaded successfully, URL:', user_image_url);
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }

            const updateData = {
                firstname: getSingleValue(firstname),
                middlename: getSingleValue(middlename),
                lastname: getSingleValue(lastname),
                email: getSingleValue(email),
                phone_number: getSingleValue(phone_number),
                gender: genderValue || existingImageUrl,
                birthday: getSingleValue(birthday),
                user_type_id: userTypeId,
                verified: verifiedBoolean,
                user_image_url
            };

            if (passwordString && passwordString !== currentPasswordHash) {
                updateData.password = await bcrypt.hash(passwordString, 10);
            }

            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('user_id', id);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log('User updated successfully:', data);
            res.status(200).json({ message: 'User updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateUser process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Helper function to get single value from array
const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;

async function changePassword(req, res) {
    try {
        const { phone_number } = req.params;

        if (!phone_number) {
            return res.status(400).json({ error: 'Phone Number is required for update' });
        }

        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Formidable error:', err);
                return res.status(500).json({ error: 'Form parsing error' });
            }

            const {
                pass,
            } = fields;

            console.log(pass)

            const passwordString = getSingleValue(pass);
            if (passwordString && typeof passwordString !== 'string') return res.status(400).json({ error: 'Invalid password type' });

            const updateData = {
                
            }

            updateData.password = await bcrypt.hash(passwordString, 10);

            const { data, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('phone_number', phone_number);

            if (error) {
                console.error('Supabase query failed:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log('User updated successfully:', data);
            res.status(200).json({ message: 'User updated successfully', data });
        });
    } catch (err) {
        console.error('Error executing updateUser process:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
    
// Helper function to get single value from array
const getSingleValue = (value) => Array.isArray(value) ? value[0] : value;
}



async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required for deletion' });
        }

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

        if (userImageUrl) {
            console.log('Deleting image associated with user:', userImageUrl);
            try {
                await imageHandler.deleteImage(userImageUrl);
                console.log('Image successfully deleted');
            } catch (deleteError) {
                console.error('Failed to delete image:', deleteError.message);
                return res.status(500).json({ error: 'Failed to delete image' });
            }
        }

        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', id);

        if (error) {
            console.error('Supabase query failed:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('User deleted successfully:', data);
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
    deleteUser,
    changePassword
};

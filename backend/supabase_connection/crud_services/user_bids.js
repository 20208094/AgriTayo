// supabase_connection/userBids.js
const supabase = require("../db");

async function getUserBids(req, res) {
  try {
    const { data, error } = await supabase.from("user_bids").select("*");

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

async function addUserBid(req, res) {
  try {
    const { bid_id, user_id, price, bid_current_highest, bid_user_id, number_of_bids } = req.body;
    console.log(bid_id, user_id, price, bid_current_highest, bid_user_id, number_of_bids)

    const { data, error } = await supabase
      .from("user_bids")
      .insert([{ bid_id, user_id, price }]);

      const getSingleValue = (value) =>
        Array.isArray(value) ? value[0] : value;

      const updateData = {
        bid_current_highest: parseFloat(getSingleValue(bid_current_highest)),
        bid_user_id: parseInt(getSingleValue(bid_user_id), 10),
        number_of_bids: parseInt(getSingleValue(number_of_bids), 10),
      }

      const { bidData, bidError } = await supabase
      .from("biddings")
      .update(updateData)
      .eq("bid_id", bid_id);

    if (error) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (bidError) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "User bid added successfully", data, bidData });
  } catch (err) {
    console.error("Unexpected error during addUserBid execution:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUserBid(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "User Bid ID is required for update" });
    }

    const { bid_id, user_id, price } = req.body;

    // Prepare update data
    const updateData = {};
    if (bid_id) updateData.bid_id = bid_id;
    if (user_id) updateData.user_id = user_id;
    if (price !== undefined) updateData.price = price;

    const { data, error } = await supabase
      .from("user_bids")
      .update(updateData)
      .eq("user_bid_id", id);

    if (error) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ message: "User bid updated successfully", data });
  } catch (err) {
    console.error("Error executing updateUserBid process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUserBid(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("user_bids")
      .delete()
      .eq("user_bid_id", id);

    if (error) {
      console.error("Supabase query failed:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ message: "User bid deleted successfully", data });
  } catch (err) {
    console.error("Error executing deleteUserBid process:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getUserBids,
  addUserBid,
  updateUserBid,
  deleteUserBid,
};

import { Buyer } from "../models/buyer.model";
import { Town } from "../models/town.model"; // Import the Town model if not already imported

export const BuyerRepository = {
  // Retrieve all buyers
  getAllBuyers: async () => {
    const buyers = await Buyer.find().populate('town');
    return buyers.map(buyer => ({
      ...buyer.toObject(),
      id: buyer._id,
      _id: undefined, // Remove _id from response
    }));
  },

  // Create a new buyer
  createBuyer: async (data: any) => {
    if (data.townId) {
      const town = await Town.findById(data.townId);
      if (!town) throw new Error("Invalid townId");
      data.town = town._id; // Map townId to town
      delete data.townId; // Remove townId from the data object
    }
    const newBuyer = new Buyer(data);
    await newBuyer.save();
    return { ...newBuyer.toObject(), id: newBuyer._id.toString(), _id: undefined };
  },

  // Update an existing buyer by ID
  updateBuyer: async (id: string, data: any) => {
    if (data.townId) {
      const town = await Town.findById(data.townId);
      if (!town) throw new Error("Invalid townId");
      data.town = town._id; // Map townId to town
      delete data.townId; // Remove townId from the data object
    }
    const updatedBuyer = await Buyer.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBuyer) throw new Error("Buyer not found");
    return { ...updatedBuyer.toObject(), id: updatedBuyer._id.toString(), _id: undefined };
  },

  // Delete a buyer by ID
  deleteBuyer: async (id: string) => {
    const deletedBuyer = await Buyer.findByIdAndDelete(id);
    if (!deletedBuyer) throw new Error("Buyer not found");
    return { message: "Buyer deleted successfully" };
  }
};

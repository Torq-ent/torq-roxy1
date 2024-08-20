import axios from "axios";

const fetchInfluencers = async () => {
  try {
    const response = await axios.get("/api/influencers");
    console.log("API Response:", response.data);

    if (response.data && response.data.influencer) {
      return response.data.influencer;
    } else {
      throw new Error("No influencer data found");
    }
  } catch (error) {
    console.error("Error fetching influencer:", error.message);
    return null;
  }
};

export default fetchInfluencers;

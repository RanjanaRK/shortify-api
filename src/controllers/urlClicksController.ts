import { Request, Response } from "express";
import { Url } from "../models/Url";
import { UrlClick } from "../models/UrlClick";

export const getUrlAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const urlId = url._id;

    const [
      totalClicks,
      browserStats,
      osStats,
      deviceStats,
      dailyClicks,
      recentClicks,
    ] = await Promise.all([
      UrlClick.countDocuments({ urlId }),

      UrlClick.aggregate([
        { $match: { urlId } },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
      ]),

      UrlClick.aggregate([
        { $match: { urlId } },
        { $group: { _id: "$os", count: { $sum: 1 } } },
      ]),

      UrlClick.aggregate([
        { $match: { urlId } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
      ]),

      UrlClick.aggregate([
        { $match: { urlId } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      UrlClick.find({ urlId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("ip browser os device referer createdAt"),
    ]);

    return res.json({
      url: url.originalUrl,
      totalClicks,
      browserStats,
      osStats,
      deviceStats,
      dailyClicks,
      recentClicks,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

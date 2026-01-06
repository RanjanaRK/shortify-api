import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { AnonymousUser } from "../models/AnonymousUser";
import { Url } from "../models/Url";
import { UrlClick } from "../models/UrlClick";
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";

export const CreateShortUrl = async (req: Request, res: Response) => {
  const base = process.env.BASE_URL!.replace(/\/$/, "");

  try {
    const { originalUrl } = req.body;

    const anonUserId = req.anonId;

    // console.log(anonUserId);

    if (!originalUrl) {
      return res.status(400).json({ message: "url is required" });
    }

    if (originalUrl.startsWith(base + "/")) {
      return res.status(400).json({
        success: false,
        message: "URL is banned",
      });
    }

    //LOGGED IN USER

    console.log(req.user?.id, ":userid from url hsorten");

    if (req.user?.id) {
      const existing = await Url.findOne({
        originalUrl,
        createdBy: req.user.id,
      });

      if (existing) {
        return res.status(201).json({
          success: true,
          message: "URL already shortened",
          shortUrl: `${process.env.BASE_URL}/api/${existing.shortCode}`,
          code: existing.shortCode,
          id: existing.id,
        });
      }
      const shortCode = nanoid(10);

      const newUrl = await Url.create({
        originalUrl,
        shortCode: shortCode,
        createdBy: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Short URL created",
        shortUrl: `${process.env.BASE_URL}/api/${shortCode}`,
        code: shortCode,
        id: newUrl.id,
      });
    }

    // ANONYMOUS USER

    if (!anonUserId) {
      return res.status(403).json({ message: "Anonymous ID missing" });
    }

    const anonUser = await AnonymousUser.findOneAndUpdate(
      { anonId: anonUserId },
      { $setOnInsert: { count: 0 } },
      { new: true, upsert: true }
    );

    if (!anonUser) {
      await AnonymousUser.create({
        anonId: anonUserId,
        count: 0,
      });
    }

    const userCount = anonUser?.count ?? 0;

    if (userCount >= 3) {
      return res
        .status(403)
        .json({ message: "Free limit reached. Please login to continue." });
    }

    const existingAnon = await Url.findOne({
      originalUrl,
      createdBy: null,
      anonId: anonUserId,
    });

    if (existingAnon) {
      return res.status(201).json({
        success: true,
        message: "URL already shortened",
        shortUrl: `${process.env.BASE_URL}/api/${existingAnon.shortCode}`,
        code: existingAnon.shortCode,
        id: existingAnon.id,
      });
    }

    const shortCode = nanoid(7);

    const saveUrl = new Url({
      originalUrl,
      shortCode,
      createdBy: null,
      anonId: anonUserId,
    });

    await saveUrl.save();

    await AnonymousUser.updateOne(
      { anonId: anonUserId },
      { $inc: { count: 1 } }
    );

    return res.status(200).json({
      message: "Your url is shorten",
      shortUrl: `${process.env.BASE_URL}/api/${shortCode}`,
      remaining: 3 - (userCount + 1),
      id: saveUrl.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const redirectShortUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOneAndUpdate(
      {
        shortCode: code,
      },
      {
        $inc: {
          clicks: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    const clientIp = requestIp.getClientIp(req);
    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();

    const urlanalytics = new UrlClick({
      urlId: url._id,
      ip: clientIp,
      os: ua.os.name,
      browser: ua.browser.name,
      device: ua.device.type || "desktop",
      referer: req.headers.referer || "direct",
    });

    return res.redirect(url.originalUrl, urlanalytics);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

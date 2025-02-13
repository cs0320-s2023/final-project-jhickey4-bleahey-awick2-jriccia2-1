import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, access_token } = req.query;
  if (isString(id) && isString(access_token)) {
    const result = await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify({
        device_ids: [id],
      }),
    });
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}

function isString(item: any): item is string {
  if (item === undefined) return false;
  if (Array.isArray(item)) return false;
  return true;
}

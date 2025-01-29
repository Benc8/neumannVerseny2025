import { NextApiRequest, NextApiResponse } from "next";
import { getServerSideProps } from "@/lib/actions/foodFetch";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  try {
    const result = await getServerSideProps(
      Array.isArray(date) ? date[0] : date || "",
    );
    res.status(200).json(result.props);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

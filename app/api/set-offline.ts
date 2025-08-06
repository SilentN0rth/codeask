// Przykład Node.js/Next.js API route (pages/api/set-offline.ts)

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "supabase/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const { userId } = req.body;

    if (!userId) {
        res.status(400).json({ error: "Missing userId" });
        return;
    }

    const { error } = await supabase.from("users").update({ is_online: false }).eq("id", userId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json({ message: "User set offline" });
}

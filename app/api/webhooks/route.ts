/* eslint-disable camelcase */
import { createUser, deleteUser, updateUser } from "@/lib/actions/getUser.action";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        // Do something with payload
        // For this guide, log payload to console
        const eventType = evt.type;

        if (eventType === "user.created") {
            const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
            const mongoUser = await createUser({
                clerkId: id,
                name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
                username,
                email: email_addresses[0].email_address,
                picture: image_url,
            });
            return NextResponse.json({ message: "OK", user: mongoUser });
            // CREATE a new user in your database.
        }

        if (eventType === "user.updated") {
            const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
            const mongoUser = await updateUser({
                clerkId: id,
                updateData: {
                    name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
                    username,
                    email: email_addresses[0].email_address,
                    picture: image_url,
                },
                path: `/profile/${id}`,
            });
            return NextResponse.json({ message: "OK", user: mongoUser });
            // CREATE a new user in your database.
        }

        if (eventType === "user.deleted") {
            const { id } = evt.data;

            const deletedUser = await deleteUser({
                clerkId: id,
            });

            return NextResponse.json({ message: "OK", user: deletedUser });
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}

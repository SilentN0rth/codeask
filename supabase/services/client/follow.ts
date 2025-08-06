import { UserInterface } from "@/types/users.types";
import { supabase } from "supabase/supabaseClient";

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .limit(1);

    if (error) {
        console.error("isFollowing error:", error);
        return false;
    }
    return (data?.length ?? 0) > 0;
}

async function updateFollowingCount(userId: string, delta: number): Promise<boolean> {
    // Pobierz aktualny following_count
    const { data, error } = await supabase.from("users").select("following_count").eq("id", userId).single();

    if (error || !data) {
        console.error("updateFollowingCount fetch error:", error);
        return false;
    }

    const newCount = Math.max(0, (data.following_count ?? 0) + delta);

    // Zaktualizuj wartość w bazie
    const { error: updateError } = await supabase.from("users").update({ following_count: newCount }).eq("id", userId);

    if (updateError) {
        console.error("updateFollowingCount update error:", updateError);
        return false;
    }

    return true;
}

async function updateFollowersCount(userId: string, delta: number): Promise<boolean> {
    // Pobierz aktualny followers_count
    const { data, error } = await supabase.from("users").select("followers_count").eq("id", userId).single();

    if (error || !data) {
        console.error("updateFollowersCount fetch error:", error);
        return false;
    }

    const newCount = Math.max(0, (data.followers_count ?? 0) + delta);

    // Zaktualizuj wartość w bazie
    const { error: updateError } = await supabase.from("users").update({ followers_count: newCount }).eq("id", userId);

    if (updateError) {
        console.error("updateFollowersCount update error:", updateError);
        return false;
    }

    return true;
}

export async function followUser(followerId: string, followingId: string): Promise<UserInterface | null> {
    const { error: insertError } = await supabase.from("follows").insert({
        follower_id: followerId,
        following_id: followingId,
    });

    if (insertError) {
        console.error("followUser insert error:", insertError);
        return null;
    }

    const followingUpdated = await updateFollowingCount(followerId, +1);
    const followersUpdated = await updateFollowersCount(followingId, +1);

    if (!followingUpdated || !followersUpdated) return null;

    // Pobierz zaktualizowanego użytkownika (followingId)
    const { data: updatedUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", followingId)
        .single();

    if (fetchError) {
        console.error("fetch updated user error:", fetchError);
        return null;
    }

    return updatedUser as UserInterface;
}

export async function unfollowUser(followerId: string, followingId: string): Promise<UserInterface | null> {
    const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

    if (deleteError) {
        console.error("unfollowUser delete error:", deleteError);
        return null;
    }

    const followingUpdated = await updateFollowingCount(followerId, -1);
    const followersUpdated = await updateFollowersCount(followingId, -1);

    if (!followingUpdated || !followersUpdated) return null;

    // Pobierz zaktualizowanego użytkownika (followingId)
    const { data: updatedUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", followingId)
        .single();

    if (fetchError) {
        console.error("fetch updated user error:", fetchError);
        return null;
    }

    return updatedUser as UserInterface;
}

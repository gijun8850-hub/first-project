import { RECENT_CROWD_REPORTS } from "@/lib/data/crowd-signals";
import {
  listLocalCrowdReports,
  saveLocalCrowdReport,
} from "@/lib/data/local-persistence";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { CrowdLabel, CrowdReport } from "@/types/recommendation";

type CrowdReportRow = {
  restaurant_id: number;
  crowd_level: CrowdLabel;
  created_at: string;
};

export async function listRecentCrowdReports(): Promise<CrowdReport[]> {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    const localReports = await listLocalCrowdReports();
    return [...localReports, ...RECENT_CROWD_REPORTS];
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("crowd_reports")
    .select("restaurant_id, crowd_level, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) {
      console.error("crowd_reports query failed", error.message);
    }
    const localReports = await listLocalCrowdReports();
    return [...localReports, ...RECENT_CROWD_REPORTS];
  }

  return (data as CrowdReportRow[]).map((row) => ({
    restaurantId: row.restaurant_id,
    crowdLevel: row.crowd_level,
    minutesAgo: Math.max(
      0,
      Math.round((Date.now() - new Date(row.created_at).getTime()) / 60000),
    ),
  }));
}

export async function saveCrowdReport(input: {
  restaurantId: number;
  sessionId: string;
  crowdLevel: CrowdLabel;
}) {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    return saveLocalCrowdReport(input);
  }

  const { error } = await supabase.from("crowd_reports").insert({
    restaurant_id: input.restaurantId,
    session_id: input.sessionId,
    crowd_level: input.crowdLevel,
    source_type: "user",
  });

  if (error) {
    console.error("crowd_reports insert failed", error.message);
    return saveLocalCrowdReport(input);
  }

  return { persisted: true as const, backend: "supabase" as const };
}

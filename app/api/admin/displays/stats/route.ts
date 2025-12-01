// app/api/displays/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Constants for display statuses
const DISPLAY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled'
} as const;

interface Display {
  id: string;
  status: string;
  user_id: string;
  name: string;
  location: string;
  created_at: string;
}

interface Stats {
  totalDisplays: number;
  activeDisplays: number;
  inactiveDisplays: number;
}

interface StatsResponse {
  success: boolean;
  stats: Stats;
  error?: string;
}

// ============================================
// GET: User's own display stats
// ============================================
export async function GET(request: NextRequest): Promise<NextResponse<StatsResponse>> {
  try {
    // ============================================
    // 1. AUTHENTICATION
    // ============================================
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 401 }
      );
    }

    // ============================================
    // 2. FETCH DISPLAYS FROM SUPABASE
    // ============================================
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: displays, error } = await supabase
      .from("displays")
      .select("id, status, user_id, name, location, created_at")
      .eq("user_id", user.id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch stats", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 500 }
      );
    }

    // ============================================
    // 3. CALCULATE STATISTICS
    // ============================================
    const displayList: Display[] = displays || [];

    const stats: Stats = {
      totalDisplays: displayList.length,
      activeDisplays: displayList.filter(
        (d) => d.status === DISPLAY_STATUS.ACTIVE
      ).length,
      inactiveDisplays: displayList.filter(
        (d) => d.status === DISPLAY_STATUS.INACTIVE || d.status === DISPLAY_STATUS.DISABLED
      ).length,
    };

    // ============================================
    // 4. RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      { success: true, stats },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );

  } catch (error) {
    console.error("Error fetching display stats:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 }
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST: Admin stats with filters (optional)
// ============================================
export async function POST(request: NextRequest): Promise<NextResponse<StatsResponse>> {
  try {
    // ============================================
    // 1. AUTHENTICATION & AUTHORIZATION
    // ============================================
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 403 }
      );
    }

    // ============================================
    // 2. PARSE REQUEST BODY
    // ============================================
    const body = await request.json().catch(() => ({}));
    const { userID, dateFrom, dateTo } = body;

    // ============================================
    // 3. FETCH DISPLAYS WITH FILTERS
    // ============================================
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from("displays")
      .select("id, status, user_id, name, location, created_at");

    // Apply filters if provided
    if (userID) {
      query = query.eq("user_id", userID);
    }
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    const { data: displays, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch stats", stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 } },
        { status: 500 }
      );
    }

    // ============================================
    // 4. CALCULATE STATISTICS
    // ============================================
    const displayList: Display[] = displays || [];

    const stats: Stats = {
      totalDisplays: displayList.length,
      activeDisplays: displayList.filter(
        (d) => d.status === DISPLAY_STATUS.ACTIVE
      ).length,
      inactiveDisplays: displayList.filter(
        (d) => d.status === DISPLAY_STATUS.INACTIVE || d.status === DISPLAY_STATUS.DISABLED
      ).length,
    };

    // ============================================
    // 5. RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      { success: true, stats },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );

  } catch (error) {
    console.error("Error fetching filtered stats:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        stats: { totalDisplays: 0, activeDisplays: 0, inactiveDisplays: 0 }
      },
      { status: 500 }
    );
  }
}
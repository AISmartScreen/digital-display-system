// app/api/displays/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Use the same authentication method as /api/auth/me
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token and get user info
    const user = await verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = user.id

    // Fetch displays for the authenticated user
    const { data: displays, error: displayError } = await supabase
      .from("displays")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (displayError) {
      console.error("Database error:", displayError)
      return NextResponse.json({ error: "Failed to fetch displays" }, { status: 500 })
    }

    return NextResponse.json(displays || [])
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Failed to fetch displays" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use the same authentication method as /api/auth/me
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token and get user info
    const user = await verifyToken(token)
    
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = user.id

    const { displayName, templateType, config } = await request.json()

    if (!displayName || !templateType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique slug
    const slug = `${displayName.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0, 8)}`

    // Insert into database
    const { data: newDisplay, error: insertError } = await supabase
      .from("displays")
      .insert({
        user_id: userId,
        name: displayName,
        template_type: templateType,
        config: config || {},
        unique_url_slug: slug,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Database error:", insertError)
      return NextResponse.json({ error: "Failed to create display" }, { status: 500 })
    }

    return NextResponse.json(newDisplay, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Failed to create display" }, { status: 500 })
  }
}
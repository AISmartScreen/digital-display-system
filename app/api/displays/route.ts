import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session cookie
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")
    
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
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
    // Get user ID from session cookie
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")
    
    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
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
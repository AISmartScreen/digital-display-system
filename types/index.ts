export type UserRole = "super_admin" | "client"
export type UserStatus = "pending" | "active" | "suspended"
export type TemplateType = "masjid" | "hospital" | "corporate"
export type DisplayStatus = "active" | "inactive"
export type FileType = "image" | "video"

export interface User {
  id: string
  email: string
  role: UserRole
  businessName: string
  businessType: string
  status: UserStatus
  createdAt: Date
}

export interface Display {
  id: string
  userId: string
  displayName: string
  templateType: TemplateType
  uniqueUrlSlug: string
  status: DisplayStatus
  createdAt: Date
  updatedAt: Date
}

export interface CustomizationConfig {
  // Masjid
  prayerTimes?: {
    fajr: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
  backgroundImages?: string[]
  announcements?: string[]
  hijriDateEnabled?: boolean

  // Hospital
  doctorSchedules?: Array<{
    name: string
    specialty: string
    time: string
    room: string
  }>
  departmentInfo?: string
  emergencyContact?: string

  // Corporate
  meetingRooms?: Array<{
    room: string
    schedule: string
    status: string
  }>
  kpiMetrics?: Record<string, string | number>

  // Shared
  colorTheme?: {
    primary: string
    secondary: string
    accent: string
  }
  slideShowDuration?: number
}

export interface MediaFile {
  id: string
  userId: string
  fileUrl: string
  fileType: FileType
  fileName: string
  fileSize: number
  uploadedAt: Date
}

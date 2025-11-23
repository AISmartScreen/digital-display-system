// Islamic date and prayer time utilities
import type { IslamicDate } from "@/types/islamic"

export function getHijriDate(): string {
  const now = new Date()
  const jd = toJulianDay(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const islamic = julianDayToIslamic(jd)

  const monthNames = [
    "Muharram",
    "Safar",
    "Rabi' al-awwal",
    "Rabi' al-thani",
    "Jumada al-awwal",
    "Jumada al-thani",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah",
  ]

  return `${islamic.day} ${monthNames[islamic.month - 1]} ${islamic.year} AH`
}

export function getPrayerInfo(prayerTimes: any, now: Date) {
  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ]

  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  let nextPrayer = prayers[0]
  let minDiff = Number.POSITIVE_INFINITY

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(":").map(Number)
    const prayerMinutes = h * 60 + m
    const diff = (prayerMinutes - currentMinutes + 1440) % 1440

    if (diff < minDiff) {
      minDiff = diff
      nextPrayer = prayer
    }
  }

  const hours = Math.floor(minDiff / 60)
  const minutes = minDiff % 60
  const seconds = Math.floor(Math.random() * 60) // Simulated seconds

  const timeUntil = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  return {
    next: nextPrayer.name,
    timeUntil,
  }
}

function toJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1
    month += 12
  }
  const a = Math.floor(year / 100)
  const b = 2 - a + Math.floor(a / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5
}

function julianDayToIslamic(jd: number): IslamicDate {
  const n = Math.floor(jd + 0.5)
  const a = n + 1
  const b = a + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)

  const day = b - d - Math.floor(30.6001 * e)
  let month = e - 1
  const year = c - 4716

  if (month > 12) month = 12

  // Gregorian to Islamic conversion
  const gregorianJD = jd - 1948440

  const islamic = Math.floor((30 * gregorianJD + 10646) / 10631)
  const p = Math.floor((11 * islamic + 3) / 30)
  const q = Math.floor(gregorianJD + 1 - Math.floor((islamic * 10631 + 10646 - p) / 30))

  const islamicYear = islamic
  const islamicMonth = Math.floor((11 * q + 330) / 325)
  const islamicDay = q - Math.floor((islamicMonth * 325 - 320) / 11) + 1

  return {
    day: Math.max(1, Math.min(30, islamicDay)),
    month: Math.max(1, Math.min(12, islamicMonth)),
    year: islamicYear,
  }
}

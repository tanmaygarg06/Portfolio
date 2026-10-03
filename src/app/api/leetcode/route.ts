import { NextResponse } from 'next/server';

export async function GET() {
  const query = `query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }`;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({ query, variables: { username: 'tanmay_garg06' } }),
      next: { revalidate: 3600 } // cache for 1 hour
    });

    const data = await response.json();
    
    if (!data?.data?.matchedUser?.userCalendar?.submissionCalendar) {
      return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 500 });
    }

    const calendar = JSON.parse(data.data.matchedUser.userCalendar.submissionCalendar);
    
    // Convert UNIX timestamps to date strings expected by react-activity-calendar
    // Format: { date: "YYYY-MM-DD", count: number, level: 0-4 }
    
    const activityData: { date: string, count: number, level: number }[] = [];
    
    // Create a date exactly 365 days ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Iterate day by day for the last year to fill missing days with 0
    for (let d = new Date(oneYearAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      // LeetCode's timestamps are start of day UTC
      const timestamp = Math.floor(d.getTime() / 1000).toString();
      
      // We also check neighboring timestamps just in case of timezone offsets
      // A more robust way is to map all LeetCode timestamps to their YYYY-MM-DD strings first
      activityData.push({
        date: dateStr,
        count: 0,
        level: 0
      });
    }

    // Now map LeetCode timestamps to actual days
    const dateMap = new Map<string, number>();
    for (const [timestamp, count] of Object.entries(calendar)) {
      const date = new Date(parseInt(timestamp) * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + (count as number));
    }

    // Merge actual data into our 365-day array and calculate levels
    let maxCount = 0;
    dateMap.forEach(count => { if (count > maxCount) maxCount = count; });

    const finalData = activityData.map(day => {
      const count = dateMap.get(day.date) || 0;
      let level = 0;
      if (count > 0) {
        if (count >= 4) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }
      return { ...day, count, level };
    });

    return NextResponse.json({
      totalActiveDays: data.data.matchedUser.userCalendar.totalActiveDays,
      streak: data.data.matchedUser.userCalendar.streak,
      calendar: finalData
    });

  } catch (error) {
    console.error("LeetCode API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

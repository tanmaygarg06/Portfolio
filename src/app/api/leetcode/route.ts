import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!data?.data?.matchedUser?.userCalendar?.submissionCalendar) {
      return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 500 });
    }

    const calendar = JSON.parse(data.data.matchedUser.userCalendar.submissionCalendar);
    
    // Map LeetCode timestamps (start of day UTC) to date strings
    const dateMap = new Map<string, number>();
    let latestSubmissionDate = "";
    
    for (const [timestamp, count] of Object.entries(calendar)) {
      const date = new Date(parseInt(timestamp) * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + (count as number));
      if (!latestSubmissionDate || dateStr > latestSubmissionDate) {
        latestSubmissionDate = dateStr;
      }
    }

    // Determine target end date (either today UTC or latest submission date, whichever is newer)
    const todayStr = new Date().toISOString().split('T')[0];
    const endDateStr = latestSubmissionDate > todayStr ? latestSubmissionDate : todayStr;
    const endDate = new Date(endDateStr + "T00:00:00Z");

    // Start 365 days prior to endDate
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 364);

    const activityData: { date: string, count: number, level: number }[] = [];
    const curDate = new Date(startDate);

    while (curDate <= endDate) {
      const dateStr = curDate.toISOString().split('T')[0];
      const count = dateMap.get(dateStr) || 0;
      let level = 0;
      if (count > 0) {
        if (count >= 4) level = 4;
        else if (count >= 3) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }
      activityData.push({ date: dateStr, count, level });
      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }

    return NextResponse.json(
      {
        totalActiveDays: data.data.matchedUser.userCalendar.totalActiveDays,
        streak: data.data.matchedUser.userCalendar.streak,
        calendar: activityData
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store'
        }
      }
    );

  } catch (error) {
    console.error("LeetCode API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

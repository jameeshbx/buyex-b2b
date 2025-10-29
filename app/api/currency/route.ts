import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base');
    const target = searchParams.get('target');

    if (!base || !target) {
      return NextResponse.json(
        { error: "Base and target currencies are required" },
        { status: 400 }
      );
    }

    if (base === target) {
      return NextResponse.json({ rate: 1 });
    }
     /* old values=/*3470db91b029770df12da2a66baa038b*/ 

    const liveRateUrl = `https://api.currencylayer.com/live?access_key=3470db91b029770df12da2a66baa038b&currencies=${base}&source=${target}&format=1`;
    
    

    const response = await fetch(liveRateUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      throw new Error(`Currency API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const key = target + base
    if (!data.quotes || !data.quotes[key]) {
      throw new Error('Invalid response from currency API');
    }
    return NextResponse.json({ rate: data.quotes[key] });
  } catch (error) {
    console.error("Currency API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
} 
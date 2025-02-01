import { NextResponse } from "next/server";
import { Expo } from "expo-server-sdk";

// Expo 푸시 SDK 인스턴스 생성
const expo = new Expo();

export async function POST(req) {
  try {
    const { pushToken, title, message, data } = await req.json();

    if (!Expo.isExpoPushToken(pushToken)) {
      return NextResponse.json({ error: "Invalid Expo push token" }, { status: 400 });
    }

    // 푸시 메시지 생성
    const messages = [
      {
        to: pushToken,
        sound: "default",
        title,
        body: message,
        data
      },
    ];

    // Expo 서버로 전송
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}

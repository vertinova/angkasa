import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { prisma } from "@backend/db/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = async () => {
        if (!user) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: "Unauthenticated" })}\n\n`));
          return;
        }
        const notifications = await prisma.notification.findMany({
          where: { userId: user.id, status: "UNREAD" },
          orderBy: { createdAt: "desc" },
          take: 5
        });
        controller.enqueue(encoder.encode(`event: notifications\ndata: ${JSON.stringify(notifications)}\n\n`));
      };

      await send();
      const timer = setInterval(send, 15_000);
      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

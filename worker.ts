export interface Env {
  ASSETS: Fetcher;
}

const API_ORIGIN = "https://marketing2advertising.ai.studio";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incomingUrl = new URL(request.url);

    // Send every API request to the existing, healthy M2A Express backend.
    if (incomingUrl.pathname.startsWith("/api/")) {
      const upstreamUrl = new URL(
        incomingUrl.pathname + incomingUrl.search,
        API_ORIGIN
      );

      const headers = new Headers(request.headers);
      headers.set("X-Forwarded-Host", incomingUrl.host);
      headers.set("X-Forwarded-Proto", incomingUrl.protocol.replace(":", ""));
      headers.delete("host");

      const init: RequestInit = {
        method: request.method,
        headers,
        redirect: "follow"
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = request.body;
      }

      try {
        const upstreamRequest = new Request(upstreamUrl.toString(), init);
        const upstreamResponse = await fetch(upstreamRequest);
        const responseHeaders = new Headers(upstreamResponse.headers);
        responseHeaders.set("X-M2A-API-Proxy", "app-m2a");

        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          statusText: upstreamResponse.statusText,
          headers: responseHeaders
        });
      } catch (error) {
        return Response.json(
          {
            error: "M2A backend is temporarily unavailable",
            message: error instanceof Error ? error.message : String(error)
          },
          { status: 502 }
        );
      }
    }

    // All non-API requests are served by the Cloudflare static asset bundle.
    return env.ASSETS.fetch(request);
  }
};

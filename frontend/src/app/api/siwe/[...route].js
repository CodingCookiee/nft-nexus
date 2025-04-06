import { siweServer } from "../../utils/siweServer";

// Export a single handler function that will handle all HTTP methods
export async function GET(request, { params }) {
  const { route } = params;
  return siweServer.apiRouteHandler(request, { route });
}

export async function POST(request, { params }) {
  const { route } = params;
  return siweServer.apiRouteHandler(request, { route });
}

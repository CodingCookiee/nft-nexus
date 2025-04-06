import { siweServer } from "../../../utils/siweServer";

export async function GET(request, { params }) {
  return siweServer.apiRouteHandler(request, { params });
}

export async function POST(request, { params }) {
  return siweServer.apiRouteHandler(request, { params });
}

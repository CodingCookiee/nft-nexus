import { siweServer } from "../../utils/siweServer";

// Export handlers for all HTTP methods that might be used
export const GET = siweServer.apiRouteHandler;
export const POST = siweServer.apiRouteHandler;

import { authMicroserviceBaseUrl } from '../config';
import * as fetch from 'node-fetch';
/**
 * @DESC Validate user token from the auth micro service
 */
const medaTicketUserAuth = async (req: any, res: any, next: any) => {
  if (req.headers.authorization == undefined) {
    return res.status(401).json({
      message: `No auth token.`,
      success: false,
    });
  }
  try {
    // Token for the auth service found
    // Forward this to the auth service and get the current user
    const response = await fetch(
      `${authMicroserviceBaseUrl}/api/users/auth/current`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: req.headers.authorization,
        },
      }
    );
    // Token valid
    if (response.status == 200) {
      req.user = await response.json();
      return next();
    } else {
      return res.status(401).json({
        message: (await response.json())?.error || `Unauthorized.`,
        success: false,
      });
    }
  } catch (error: any) {
    return res.status(401).json({
      message: error?.message || `Unauthorized.`,
      success: false,
    });
  }
};
export default medaTicketUserAuth;

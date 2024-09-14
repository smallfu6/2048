import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  //   clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
});

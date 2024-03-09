export const verifySignupPayload = (payload: any) => {
  if (
    payload &&
    typeof payload.email === "string" &&
    typeof payload.firstname === "string" &&
    typeof payload.lastname === "string" &&
    typeof payload.password === "string"
  ) {
    return true;
  } else {
    return false;
  }
};

export const verifyLoginPayload = (payload: any) => {
  if (
    payload &&
    typeof payload.email === "string" &&
    typeof payload.password === "string"
  ) {
    return true;
  } else {
    return false;
  }
};

export const verifyUserSignupPayload = (payload: any) => {
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

export const verifyUserLoginPayload = (payload: any) => {
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

export const verifyAdminSignupPayload = (payload: any) => {
  if (
    payload &&
    typeof payload.email === "string" &&
    typeof payload.firstname === "string" &&
    typeof payload.lastname === "string" &&
    typeof payload.password === "string" &&
    typeof payload.admintoken === "string"
  ) {
    return true;
  } else {
    return false;
  }
};


export const verifyAdminLoginPayload = (payload: any) => {
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
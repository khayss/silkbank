export const verifyUserSignupPayload = (payload: any) => {
  if (
    payload &&
    typeof payload.email === "string" &&
    typeof payload.firstname === "string" &&
    typeof payload.lastname === "string" &&
    typeof payload.password === "string" &&
    payload.email.length > 5 &&
    payload.firstname.length > 1 &&
    payload.lastname.length > 1
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

export const getUserBy = (user: any) => {
  if (user && typeof user.email === "string") {
    return "email";
  } else if (user && typeof user.accountnumber === "string") {
    return "account-number";
  } else if (
    user &&
    typeof user.email === "string" &&
    typeof user.accountnumber === "string"
  ) {
    return "both";
  } else {
    return "invalid";
  }
};

export const verifyAdminTxnPayload = (details: any) => {
  if (
    details &&
    typeof details.admincode === "string" &&
    typeof details.amount === "string" &&
    typeof details.accountnumber === "string" &&
    typeof details.adminemail === "string"
  ) {
    return true;
  } else {
    return false;
  }
};

export const verifyUserTxnPayload = (details: any) => {
  if (
    details &&
    typeof details.usercode === "string" &&
    typeof details.amount === "string" &&
    typeof details.accountnumber === "string" &&
    typeof details.useraccount === "string"
  ) {
    return true;
  } else {
    return false;
  }
};

export const verifySuspendUserPayload = (details: any) => {
  if (
    details &&
    typeof details.admincode === "string" &&
    typeof details.accountnumber === "string" &&
    typeof details.adminemail === "string"
  ) {
    return true;
  } else {
    return false;
  }
};

import Cookies from "js-cookie";

export function setTokenCookie(token: string) {
    Cookies.set("access_token", token, { expires: 7, sameSite: "lax" });
}

export function getTokenCookie() {
    return Cookies.get("access_token");
}

export function removeTokenCookie() {
    Cookies.remove("access_token");
}

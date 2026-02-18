export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function getTokenType(): string {
  return localStorage.getItem("tokenType") ?? "Bearer";
}

import { useEffect, useState } from "react";

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessTokenFromCookie = () => {
      const cookies = document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("accessToken="));

      if (cookies) {
        const token = cookies.split("=")[1];
        setAccessToken(token);
      }
    };

    getAccessTokenFromCookie();
  }, []);

  return accessToken;
}

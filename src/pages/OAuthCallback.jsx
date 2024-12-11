import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const OAuthCallback = () => {
  console.log("OAuthCallback component loaded");
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  // 로그인 성공 시 호출
  const handleLogin = (userData) => {
    setUserInfo(userData);
    navigate("/profile"); // 프로필 페이지로 이동
  };

  // 초기 정보 입력 페이지로 이동
  const handleInit = () => {
    navigate("/initialinfo");
  };

  useEffect(() => {
    console.log("OAuthCallback component mounted");

    // URL에서 인증 코드 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // 인증 코드를 백엔드로 보내는 함수
    const handleLoginPost = async (authCode) => {
      try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    
        console.log("Sending request to backend with code:", authCode);
    
        const response = await fetch(`${apiUrl}/api/v1/users/login?code=${authCode}`, {
          method: "GET",
          headers: {
            Accept: "application/json", // JSON 응답을 기대
            //"Content-Type": "application/json", // JSON 형식으로 전송
          },
        });
    
        // 응답 상태 확인
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Response Data:", data);
    
        const userData = data?.data;
        console.log("Extracted User Data:", userData);
    
        const accessToken = userData?.jwtToken?.accessToken;
        const refreshToken = userData?.jwtToken?.refreshToken;
        console.log("Extracted Access Token:", accessToken);
        console.log("Extracted Refresh Token:", refreshToken);
    
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          console.log("Access Token saved to localStorage:", accessToken);
        } else {
          console.error("Access Token is missing in response.");
        }
    
        // 사용자 상태에 따른 분기 처리
        if (userData?.status === "LOGIN") {
          handleLogin(userData);
        } else if (userData?.status === "REGISTER") {
          setUserInfo(userData); // 사용자 정보 설정
          handleInit();          // 초기 정보 입력 페이지로 이동
        } else {
          handleInit();
        }
      } catch (error) {
        console.error("Login Error:", error.message);
        handleInit();
      } finally {
        // URL에서 인증 코드 제거
        window.history.replaceState(null, "", "/oauth/google/callback");
      }
    };
    

    if (code) {
      console.log("Authorization Code found:", code);
      handleLoginPost(code);
    } else {
      console.error("Google authorization code not found.");
      handleInit();
    }
  }, [navigate, setUserInfo]);

  return (
    <div>
      <h2>로그인 중...</h2>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default OAuthCallback;

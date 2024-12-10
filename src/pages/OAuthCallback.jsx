import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";

const OAuthCallback = () => {
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

  // URL에서 인증 코드 추출
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code"); // Google에서 제공한 인증 코드

  console.log("Raw code:", code); // 디버깅용

  // 인증 코드를 백엔드로 보내는 함수
  const handleLoginPost = async (authCode) => {
    // URL-safe 인코딩된 authCode 생성
    const encodedAuthCode = encodeURIComponent(authCode);
    const data = { authCode: code };

    console.log("Sending encoded data:", data); // 인코딩된 payload 값 확인

    try {
      const res = await axios.post(
        "http://43.203.202.100.nip.io:8080/api/v1/users/login", // 환경변수 사용
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response Data:", res.data);

      const userData = res.data?.data;
      const accessToken = userData?.jwtToken?.accessToken;

      if (accessToken) {
        localStorage.setItem("bagtoken", accessToken); // Access Token 저장
        console.log("Access Token saved:", accessToken);
      } else {
        console.error("Access Token is missing in response.");
      }

      // 로그인 상태에 따른 페이지 이동
      if (userData?.status === "LOGIN") {
        handleLogin(userData);
      } else {
        handleInit();
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      handleInit(); // 에러 발생 시 초기 정보 입력 페이지로 이동
    }
  };

  // 컴포넌트가 마운트될 때 인증 코드 처리
  useEffect(() => {
    if (code) {
      handleLoginPost(code); // 인증 코드 전달
    } else {
      console.error("Google authorization code not found.");
      handleInit(); // 인증 코드가 없을 경우 초기 정보 입력 페이지로 이동
    }
  }, [code]);

  return (
    <div>
      <h2>로그인 중...</h2>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default OAuthCallback;

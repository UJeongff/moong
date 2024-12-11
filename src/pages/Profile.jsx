import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: white;
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
`;

const Content = styled.div`
  flex: 1;
  padding: 16px;
`;

const InfoCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .label {
    font-size: 14px;
    font-weight: bold;
    color: #555;
    margin-bottom: 4px;
  }

  .value {
    font-size: 16px;
    color: #333;
  }
`;

const Profile = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 사용자 프로필을 백엔드에서 가져오는 함수
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/profile/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        setUserInfo(data); // Context에 사용자 정보 업데이트
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("프로필 정보를 가져오는 데 실패했습니다:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Container>
        <Header title="프로필" />
        <Content>
          <p>로딩 중...</p>
        </Content>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header title="프로필" />
        <Content>
          <p>프로필 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.</p>
        </Content>
        <Footer />
      </Container>
    );
  }

  // 기본값을 제공하는 profileData 정의
  const profileData = {
    name: userInfo?.name || "홍길동",
    email: userInfo?.email || "이메일을 입력해주세요",
    phone: userInfo?.phoneNumber || "전화번호를 입력해주세요",
    birthDate: userInfo?.birthday || "생년월일을 입력해주세요",
    department: userInfo?.department || "학과를 입력해주세요",
    studentId: userInfo?.studentNumber || "학번을 입력해주세요",
  };

  return (
    <Container>
      <Header title="프로필" />
      <Content>
        <InfoCard>
          <div className="label">이름</div>
          <div className="value">{profileData.name}</div>
        </InfoCard>
        <InfoCard>
          <div className="label">이메일</div>
          <div className="value">{profileData.email}</div>
        </InfoCard>
        <InfoCard>
          <div className="label">핸드폰</div>
          <div className="value">{profileData.phone}</div>
        </InfoCard>
        <InfoCard>
          <div className="label">생년월일</div>
          <div className="value">{profileData.birthDate}</div>
        </InfoCard>
        <InfoCard>
          <div className="label">학과</div>
          <div className="value">{profileData.department}</div>
        </InfoCard>
        <InfoCard>
          <div className="label">학번</div>
          <div className="value">{profileData.studentId}</div>
        </InfoCard>
      </Content>
      <Footer />
    </Container>
  );
};

export default Profile;

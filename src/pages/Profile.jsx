import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
  const { userInfo } = useContext(UserContext);

  // 더미 데이터
  const profileData = userInfo || {
    name: "테스트 사용자",
    email: "testuser@example.com",
    phone: "010-1234-5678",
    birthDate: "1995-01-01",
    department: "컴퓨터공학과",
    studentId: "201900123",
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

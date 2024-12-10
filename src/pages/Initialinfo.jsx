import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";  // axios import 추가

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  background-color: white;
  font-weight: bold;
  font-size: 20px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    font-weight: bold;
    color: #555;
    margin-bottom: 8px;
  }

  input {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 1px solid #ddd;
`;

const AgreementSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  input[type="checkbox"] {
    margin-right: 8px;
  }

  label {
    font-size: 14px;
    color: #555;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-left: 8px;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 20px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#0056b3")};
  }
`;

const InitialInfo = () => {
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    profileImage: "",
    email: "",
    phone: "",
    birthDate: "",
    department: "",
    studentId: "",
  });

  const [errors, setErrors] = useState({});
  const [agreement, setAgreement] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (form.profileImage !== reader.result) {
          setForm({ ...form, profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.profileImage) newErrors.profileImage = "프로필 이미지를 업로드해주세요.";
    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요.";
    if (!form.phone.trim()) newErrors.phone = "핸드폰 번호를 입력해주세요.";
    if (!form.birthDate.trim()) newErrors.birthDate = "생년월일을 선택해주세요.";
    if (!form.department.trim()) newErrors.department = "학과를 입력해주세요.";
    if (!form.studentId.trim()) newErrors.studentId = "학번을 입력해주세요.";
    if (!agreement) newErrors.agreement = "동의해야 저장이 가능합니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        // localStorage에서 accessToken 가져오기
        const token = localStorage.getItem("accessToken");
  
        // accessToken이 없다면 401 오류가 발생할 수 있음
        if (!token) {
          console.error("Access token이 없습니다. 로그인 후 다시 시도하세요.");
          navigate("/login");
          return;
        }
  
        // 사용자 정보를 백엔드에 저장
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/save`,  // 엔드포인트 URL
          form,                   // 사용자 정보
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,  // Authorization 헤더에 accessToken 추가
            },
            withCredentials: true,  // 쿠키 인증을 포함
          }
        );
  
        if (response.status === 200) {
          // 백엔드 응답에서 JWT 토큰과 사용자 정보를 받아와 localStorage에 저장
          localStorage.setItem("accessToken", response.data.jwtToken.accessToken);
          localStorage.setItem("refreshToken", response.data.jwtToken.refreshToken);
  
          // 프로필 페이지로 이동
          navigate("/profile");
        }
      } catch (error) {
        console.error("정보 저장 오류:", error);
        navigate("/login");
      }
    }
  };
  
  return (
    <Container>
      <Header>초기 정보 입력</Header>
      <Content>
        <InputGroup>
          <label>프로필 이미지</label>
          {form.profileImage && <ImagePreview src={form.profileImage} alt="프로필 미리보기" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {errors.profileImage && <div className="error">{errors.profileImage}</div>}
        </InputGroup>
        <InputGroup>
          <label>이메일</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="error">{errors.email}</div>}
        </InputGroup>
        <InputGroup>
          <label>핸드폰</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </InputGroup>
        <InputGroup>
          <label>생년월일</label>
          <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
          {errors.birthDate && <div className="error">{errors.birthDate}</div>}
        </InputGroup>
        <InputGroup>
          <label>학과</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} />
          {errors.department && <div className="error">{errors.department}</div>}
        </InputGroup>
        <InputGroup>
          <label>학번</label>
          <input type="text" name="studentId" value={form.studentId} onChange={handleChange} />
          {errors.studentId && <div className="error">{errors.studentId}</div>}
        </InputGroup>
        <AgreementSection>
          <input
            type="checkbox"
            checked={agreement}
            onChange={(e) => {
              setAgreement(e.target.checked);
              setErrors({ ...errors, agreement: "" });
            }}
          />
          <label>사기 행각 발각 시 거래 품목 원가의 10배에 해당하는 벌금을 지불할 것에 동의합니다</label>
        </AgreementSection>
        {errors.agreement && <div className="error">{errors.agreement}</div>}
        <SaveButton onClick={handleSave} disabled={!agreement}>
          저장
        </SaveButton>
      </Content>
    </Container>
  );
};

export default InitialInfo;
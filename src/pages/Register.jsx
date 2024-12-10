import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 393px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
  background-color: white;
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: white;
  font-weight: bold;
  font-size: 20px;
  border-bottom: 1px solid #ddd;
`;

const UploadSection = styled.section`
  display: flex;
  align-items: center;
  margin: 16px 0;
  gap: 10px;
  width: 100%;

  .upload-box {
    width: 100px;
    height: 100px;
    border: 1px dashed #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 12px;
    color: #555;
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;

  label {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    margin-right: 16px;
    min-width: 80px;
  }

  input,
  textarea {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;
  }

  textarea {
    resize: none;
    height: 100px;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const CategorySection = styled.section`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;

  h4 {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    margin-right: 16px;
    min-width: 80px;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex: 1;

  button {
    padding: 8px 12px;
    border: none;
    background-color: #d9d9d9;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    width: 80px;
    height: 30px;

    &.selected {
      background-color: #555;
      color: white;
    }
  }
`;

const SelectionRow = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 8px 12px;
    border: none;
    background-color: #d9d9d9;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
    height: 40px;

    &.selected {
      background-color: #555;
      color: white;
    }
  }
`;


const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  position: relative;
`;

const TermsSection = styled.section`
  margin-top: 20px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.active {
    font-weight: bold;
  }

  svg {
    transform: ${(props) => (props.isOpen ? "rotate(90deg)" : "rotate(0)")};
    transition: transform 0.3s ease;
  }
`;

const TermsContent = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  color: #555;
  font-size: 14px;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;

  button {
    flex: 1;
    height: 40px;
    margin: 0 5px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }

  .cancel-btn {
    background-color: #f5f5f5;
    color: #555;
  }

  .submit-btn {
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : "#007bff")}; /* 비활성화시 회색, 활성화 시 파란색 */
  color: ${(props) => (props.disabled ? "#888" : "white")}; /* 비활성화 시 회색, 활성화 시 흰색 */
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")}; /* 비활성화 시 커서 변경 */
}
`;

const Register = () => {
  const { userInfo, ongoingProducts, setOngoingProducts } = useContext(UserContext);
  const idRef = useRef(Math.max(...ongoingProducts.map((product) => product.id), 0) + 1);

  const [input, setInput] = useState({
    id: idRef.current,
    date: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    image: null,
    productName: "",
    category: "",
    type: "",
    content: "",
    status: "거래가능",
    possibleDate: new Date().toISOString().split("T")[0],
    price: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [activeTerms, setActiveTerms] = useState({}); // 각 항목별 토글 상태
  const [checklist, setChecklist] = useState({
    termsConfirmed: false, // 기본 상태
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!input.productName) newErrors.productName = "입력하세요.";
    if (!input.category) newErrors.category = "선택하세요.";
    if (!input.type) newErrors.type = "선택하세요.";
    if (!input.price) newErrors.price = "입력하세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInput({ ...input, image: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setInput({ ...input, category });
  };

  const handleTypeClick = (type) => {
    setInput({ ...input, type });
  };

  const handleSubmit = () => {
    if (!validate()) {
      return; // 유효성 검사 실패 시 모달을 열지 않음
    }
    setIsModalOpen(true); // 모든 입력이 올바르면 모달 열기
  };

  const handleCancel = () => {
    navigate("/"); // 취소 버튼 클릭 시
  };

  const toggleTermsContent = (term) => {
    setActiveTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecklist((prev) => ({ ...prev, [name]: checked }));
  };  

  const handleRegisterConfirm = () => {
    if (!validate()) return;


    const newProduct = {
      id: idRef.current++,
      image: input.image,
      productName: input.productName,
      category: input.category,
      content: input.content,
      status: "거래가능",
      possibleDate: input.possibleDate,
      price: input.price,
      date: new Date().toLocaleDateString("ko-KR"),
      type: input.type,
      userId: userInfo.id,
      userName: userInfo.name,
      profileImage: userInfo.profileImage || "/default-profile.png",
    };

    setOngoingProducts((prev) => {
      const updatedProducts = [newProduct, ...prev];
      localStorage.setItem("ongoingProducts", JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    navigate("/");
  };

  return (
    <Container>
      <Header>상품 등록</Header>
      <UploadSection>
        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          {previewImage ? (
            <img src={previewImage} alt="미리보기" />
          ) : (
            "사진/동영상 업로드"
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </UploadSection>
      <InputRow>
        <label>상품명</label>
        <input
          type="text"
          name="productName"
          value={input.productName}
          onChange={onChangeInput}
        />
        {errors.productName && <span className="error">{errors.productName}</span>}
      </InputRow>
      <CategorySection>
        <h4>카테고리</h4>
        <CategoryList>
          {["서적", "생활용품", "전자제품", "의류", "잡화", "기타"].map(
            (category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category ? "selected" : ""}
              >
                {category}
              </button>
            )
          )}
        </CategoryList>
        {errors.category && <span className="error">{errors.category}</span>}
      </CategorySection>
      <CategorySection>
        <h4>대여/판매</h4>
        <SelectionRow>
          {["대여", "판매"].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={input.type === type ? "selected" : ""}
            >
              {type}
            </button>
          ))}
        </SelectionRow>
        {errors.type && <span className="error">{errors.type}</span>}
      </CategorySection>
      <InputRow>
        <label>상세설명</label>
        <textarea
          name="content"
          value={input.content}
          onChange={onChangeInput}
        />
      </InputRow>
      <InputRow>
        <label>거래/반납 날짜</label>
        <input
          type="date"
          name="possibleDate"
          value={input.possibleDate}
          onChange={onChangeInput}
        />
      </InputRow>
      <InputRow>
        <label>판매/보증 금액</label>
        <input
          type="text"
          name="price"
          value={input.price}
          onChange={onChangeInput}
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </InputRow>
      <ButtonContainer>
        <button className="cancel-btn" onClick={handleCancel}>
          취소
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          등록
        </button>
      </ButtonContainer>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2>약관 동의</h2>
          <TermsSection>
            <ToggleButton
              isOpen={activeTerms.term1}
              onClick={() => toggleTermsContent("term1")}
            >
              <span>1. 대여 상품 미반납 시 약관</span>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M3 0 L7 5 L3 10 Z" />
              </svg>
            </ToggleButton>
            {activeTerms.term1 && (
              <TermsContent>
                - 대여자는 반드시 반납 날짜까지 대여 상품을 반납해야 한다.<br />
                - 반납 날짜까지 반납하지 않을 시 보증금을 돌려받지 못하며 최대 3일 이내 반드시 반납해야 한다.<br />
                - 3일 이후에도 반납하지 않을 시, 대여 상품 원가에 해당하는 금액을 지급해야 하며 최대 5일 이내로 반드시 반납해야 한다.<br />
                - 만약 그 이후에도 반납하지 않을 시 형법 제355조에 의거, 횡령죄로 간주하여 법적인 처벌을 받을 수 있다.
              </TermsContent>
            )}
          </TermsSection>
          <TermsSection>
            <ToggleButton
              isOpen={activeTerms.term2}
              onClick={() => toggleTermsContent("term2")}
            >
              <span>2. 대여 시 상품 파손에 관한 약관</span>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M3 0 L7 5 L3 10 Z" />
              </svg>
            </ToggleButton>
            {activeTerms.term2 && (
              <TermsContent>
                상품 소유주는 상품 등록 시 상품의 정확한 사진을 등록하여 반납 시 상태와 확실한 구별이 가능하게 한다.
                만약 소유주의 실수로 대여 전후 상태의 차이 확인이 불가능할 경우 소유주의 책임으로 간주한다.
                대여자는 상품 반납 시, 대여 전과 동일한 상태를 유지해야 한다. 맨눈으로 확인할 수 있는 찍힘, 긁힘, 오염 등의 파손의 경우 대여자는 수리비 전액을 지급해야 한다.
                <br />
                <br />
                서적의 경우 상품의 소유주는 대여자의 추가적인 필기가 가능함에 동의한다. 단, 서적의 원본 글씨를 알아볼 수 없을 정도의 낙서가 생겼을 경우, 해당 경우는 파손으로 간주, 대여자는 소유주에게 전공 서적 원가의 절반에 해당하는 금액을 지불한다.
                상품의 소유주는 서적의 특성상 서적의 약간의 구겨짐, 찢어짐 등 약간의 훼손은 불가피함에 동의한다. 단, 서적을 읽음에 있어 글씨의 정확한 확인이 불가능할 정도의 훼손은 파손으로 간주, 대여자는 소유주에게 전공 서적 원가의 절반에 해당하는 금액을 지불한다.
              </TermsContent>
            )}
          </TermsSection>
          <TermsSection>
            <label>
              <input
                type="checkbox"
                name="termsConfirmed"
                checked={checklist.termsConfirmed}
                onChange={handleCheckboxChange}
              />
              <span>약관을 모두 확인했습니다.</span>
            </label>
          </TermsSection>
          <ButtonContainer>
            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
              닫기
            </button>
            <button
              className="submit-btn"
              disabled={!checklist.termsConfirmed} // 약관을 모두 확인했을 때만 활성화
              onClick={handleRegisterConfirm}
              style={{
                backgroundColor: checklist.termsConfirmed ? "#007bff" : "#f0f0f0",
                color: checklist.termsConfirmed ? "white" : "#888",
              }}
            >
              동의하고 등록
            </button>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Register;

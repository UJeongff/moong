import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  overflow-y: auto; /* 스크롤 가능 */
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 16px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .search-icon {
    font-size: 20px;
    color: #333;
    cursor: pointer;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* 클릭 가능한 UI로 변경 */
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
  text-align: center; /* 중앙 정렬 */
  margin-left: 10px;

  .title-row {
    display: flex;
    justify-content: center; /* 중앙 배치 */
    align-items: center; /* 세로 정렬 */
    gap: 8px; /* 상품명과 대여/판매 정보 간격 */
  }

  .product-name {
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap; /* 한 줄 유지 */
    overflow: hidden;
    text-overflow: ellipsis; /* 말줄임 표시 */
  }

  .type {
    font-size: 12px;
    font-weight: bold;
  }

  .type.rental {
    color: red; /* 대여는 빨간색 */
  }

  .type.sale {
    color: blue; /* 판매는 파란색 */
  }

  p {
    font-size: 12px;
    color: #555;
  }
`;

const RegisterButton = styled.button`
  position: fixed;
  bottom: 70px; /* Footer 위로 이동 */
  left: 50%; /* 중앙 정렬 */
  transform: translateX(-50%);
  width: 80%;
  max-width: 393px;
  height: 50px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const Main = () => {
  const { ongoingProducts } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <h1>가천대학교 뭉치서비스</h1>
        <FaSearch
          className="search-icon"
          onClick={() => navigate("/search")} // /search로 이동
        />
      </Header>
      <ItemList>
        {ongoingProducts.length === 0 ? (
          <p>등록된 상품이 없습니다. 상품을 등록해보세요!</p>
        ) : (
          ongoingProducts.map((product) => (
            <ItemCard
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)} // 상세 페이지로 이동
            >
              <ItemImage
                src={product.image || "/default-image.png"}
                alt={product.productName}
              />
              <ItemDetails>
                {/* 상품명과 대여/판매 정보를 중앙 정렬 */}
                <div className="title-row">
                  <span className="product-name">{product.productName}</span>
                  <span
                    className={`type ${
                      product.type === "대여" ? "rental" : "sale"
                    }`}
                  >
                    {product.type}
                  </span>
                </div>
                <p>{product.price}원</p>
                <p>{product.date}</p>
              </ItemDetails>
            </ItemCard>
          ))
        )}
      </ItemList>
      <RegisterButton onClick={() => navigate("/register")}>
        + 상품 등록
      </RegisterButton>
      <Footer />
    </Container>
  );
};

export default Main;

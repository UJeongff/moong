import "./App.css"; 
import {
  useReducer,
  useRef,
  createContext,
  useState,
  useEffect,
} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Notfound from "./pages/Notfound";
import Mypage from "./pages/Mypage";
import Main from "./pages/Main";
import Wishlist from "./pages/Wishlist";
import Ongoing from "./pages/Ongoing";
import Closed from "./pages/Closed";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";
import Search from "./pages/Search";
import SearchResult from "./pages/SearchResult";
import Initialinfo from "./pages/Initialinfo";
import Review from "./pages/Review";
import Chat from "./pages/Chat";
import ChatDetail from "./pages/ChatDetail";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import ReviewList from "./pages/Reviewlist";
import ProfileOther from "./pages/ProfileOther";

// Context 생성
export const ProductStateContext = createContext();
export const ProductDispatchContext = createContext();
export const UserContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    default:
      return state;
  }
}

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  // userInfo 초기 상태를 로컬 스토리지에서 불러오기
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : {
      name: "",
      email: "",
      //profileImage: "",
      phoneNumber: "",
      birthday:"",
      studentNumber:"",
      department:"",
    };
  });

  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews ? JSON.parse(savedReviews) : [];
  });

  const [favoriteProducts, setFavoriteProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteProducts")) || [];
  });

  const [ongoingProducts, setOngoingProducts] = useState(() => {
    const saved = localStorage.getItem("ongoingProducts");
    return saved ? JSON.parse(saved) : [];
  });

  const [closedProducts, setClosedProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("closedProducts")) || [];
  });

  const [chatData, setChatData] = useState(() => {
    return JSON.parse(localStorage.getItem("chatData")) || {};
  });

  const idRef = useRef(
    Math.max(
      ...ongoingProducts.map((product) => product.id),
      ...closedProducts.map((product) => product.id),
      0
    ) + 1
  );

  const isLoggedIn = !!userInfo?.email;

  useEffect(() => {
    console.log("App.jsx - userInfo:", userInfo);
    console.log("App.jsx - isLoggedIn:", isLoggedIn);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo, isLoggedIn]);  

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
  }, [favoriteProducts]);

  useEffect(() => {
    localStorage.setItem("ongoingProducts", JSON.stringify(ongoingProducts));
  }, [ongoingProducts]);

  useEffect(() => {
    localStorage.setItem("closedProducts", JSON.stringify(closedProducts));
  }, [closedProducts]);

  useEffect(() => {
    localStorage.setItem("chatData", JSON.stringify(chatData));
  }, [chatData]);

  const onCreate = (
    image,
    productName,
    category,
    content,
    possibleDate,
    price,
    type
  ) => {
    const newProduct = {
      id: idRef.current++,
      image,
      productName,
      category,
      content,
      possibleDate,
      price,
      type,
      date: new Date().toLocaleDateString("ko-KR"),
      status: "거래가능",
      userId: userInfo?.id,
    };

    setOngoingProducts((prev) => [newProduct, ...prev]);
    dispatch({ type: "CREATE", data: newProduct });
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        setUserInfo,
        reviews,
        setReviews,
        favoriteProducts,
        setFavoriteProducts,
        ongoingProducts,
        setOngoingProducts,
        closedProducts,
        setClosedProducts,
        chatData,
        setChatData,
      }}
    >
      <ProductStateContext.Provider value={data}>
        <ProductDispatchContext.Provider value={{ onCreate }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="/register"
              element={isLoggedIn ? <Register /> : <Navigate to="/login" />}
            />
            <Route
              path="/product/:id"
              element={isLoggedIn ? <Product /> : <Navigate to="/login" />}
            />
            <Route
              path="/mypage"
              element={isLoggedIn ? <Mypage /> : <Navigate to="/login" />}
            />
            <Route
              path="/chat"
              element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
            />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/ongoing-transaction" element={<Ongoing />} />
            <Route path="/closed-transaction" element={<Closed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/search" element={<Search />} />
            <Route path="/searchresult" element={<SearchResult />} />
            <Route path="/initialinfo" element={<Initialinfo />} />
            <Route path="/review" element={<Review />} />
            <Route path="/chat/:id" element={<ChatDetail />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/google/callback" element={<OAuthCallback />} />
            <Route path="/reviewlist" element={<ReviewList />} />
            <Route path="/profileother/:id" element={<ProfileOther />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </ProductDispatchContext.Provider>
      </ProductStateContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

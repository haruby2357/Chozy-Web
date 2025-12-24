// 상품페이지의 메인페이지
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Nav from "../../components/Nav";
import Category from "./components/Category";
import SearchBar from "../../components/SearchBar";
import Product from "./components/Product";

import cloth from "../../assets/goodsPage/category/cloth.svg";
import beauty from "../../assets/goodsPage/category/beauty.svg";
import diy from "../../assets/goodsPage/category/diy.svg";
import game from "../../assets/goodsPage/category/game.svg";
import cooking from "../../assets/goodsPage/category/cooking.svg";
import pet from "../../assets/goodsPage/category/pet.svg";
import electronics from "../../assets/goodsPage/category/electronics.svg";
import car from "../../assets/goodsPage/category/car.svg";
import examProd from "../../assets/goodsPage/examProd.svg";

const categories = [
  { imgSrc: cloth, label: "의류/잡화" },
  { imgSrc: beauty, label: "뷰티/건강" },
  { imgSrc: diy, label: "취미/DIY" },
  { imgSrc: game, label: "완구/게임" },
  { imgSrc: cooking, label: "홈데코/주방" },
  { imgSrc: pet, label: "반려동물" },
  { imgSrc: electronics, label: "전자제품" },
  { imgSrc: car, label: "자동차용품" },
];

function Home() {
  const navigate = useNavigate();

  // 서버에서 데이터 받아오기전 "인기검색어" 더미데이터
  const searchKey = [
    "여성가을옷",
    "헤어밴드",
    "폰케이스",
    "두바이쫀득쿠키",
    "남성겨울옷", // 화면 넘어갈 시 스크롤 여부 테스트 위함
  ];

  // 서버에서 데이터 받아오기전 "상품" 더미데이터
  const products = [
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "약국용 센소다인 후레쉬 120g",
      price: 15500,
      discountRate: 12,
      discountPrice: 13500,
      rating: 4.5,
      reviewCnt: 10320,
      deliveryFee: 0,
      liked: true,
    },
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "제품명제품명길어지면제품명제품명제품명제품명",
      price: 49400000000000,
      discountRate: 42,
      discountPrice: 610000000,
      rating: 4.5,
      reviewCnt: 360,
      deliveryFee: 3000,
      liked: false,
    },
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "약국용 센소다인 후레쉬 120g",
      price: 15500,
      discountRate: 12,
      discountPrice: 13500,
      rating: 4.5,
      reviewCnt: 10320,
      deliveryFee: 0,
      liked: true,
    },
  ];

  // 서버 연동 전 하트 토글위한 코드
  const [productList, setProductList] = useState(products);
  const handleToggleLike = (index: number) => {
    setProductList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, liked: !item.liked } : item
      )
    );
  };

  return (
    <>
      <Header />
      <main className="pt-[43px] flex flex-col gap-3">
        {/* 검색창 && 인기검색어 */}
        <div className="flex flex-col px-4 pt-2 pb-3 gap-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]">
          <SearchBar />
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[14px] whitespace-nowrap">
              인기 검색어
            </span>
            <div className="flex flex-1 min-w-0 gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {searchKey.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => {
                    navigate(
                      `/goods/search?keyword=${encodeURIComponent(keyword)}&source=popular`
                    );
                  }}
                  className="flex-shrink-0 text-[#787878] text-[14px]"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="w-full bg-white grid grid-cols-4 grid-rows-2 px-4 gap-2">
          {categories.map((category) => (
            <Category
              imgSrc={category.imgSrc}
              label={category.label}
              onClick={() => {
                navigate(
                  `/goods/search?keyword=${encodeURIComponent(category.label)}&source=category`
                );
              }}
            />
          ))}
        </div>

        {/* 상품 추천 */}
        <div className="pt-4 px-4 flex flex-col bg-white gap-4">
          <p className="font-semibold text-[16px]">이런 상품은 어떠세요?</p>
          <div
            className="grid gap-x-1 gap-y-4 
          [grid-template-columns:repeat(auto-fill,minmax(177px,1fr))]
          justify-items-start"
          >
            {productList.map((product, index) => (
              <Product
                key={product.name}
                source={product.source}
                imgUrl={product.imgUrl}
                productUrl={product.productUrl}
                name={product.name}
                price={product.price}
                discountRate={product.discountRate}
                discountPrice={product.discountPrice}
                rating={product.rating}
                reviewCnt={product.reviewCnt}
                deliveryFee={product.deliveryFee}
                liked={product.liked}
                onToggleLike={() => handleToggleLike(index)}
              />
            ))}
          </div>
        </div>
      </main>
      <Nav />
    </>
  );
}

export default Home;

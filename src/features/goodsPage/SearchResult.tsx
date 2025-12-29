import { useEffect, useState } from "react";
import SearchBar2 from "../../components/SearchBar2";
import Sort, { type SortKey } from "./components/Sort";
import Product from "./components/Product";
import examProd from "../../assets/goodsPage/examProd.svg";

export default function SearchResult() {
  const [sort, setSort] = useState<SortKey>("relevance");

  // 서버에서 데이터 받아오기전 상품 더미데이터
  // 검색 키워드 && 필터 && 정렬을 넘기고 한번에 배열로 데이터 받아오기..?
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

  useEffect(() => {
    //실제 서버 연동시 사용
    console.log("정렬:", { sort });
  }, [sort]);

  return (
    <>
      <SearchBar2 />
      {/* 상품 검색 화면 완성 시 검색창 누르면 상품 검색 화면으로 이동 추가 */}
      <div className="pt-[68px]">
        {/* 추후 필터 컴포넌트 삽입 */}
        <div className="h-1" />
        <div className="bg-white pt-4 px-4 flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            <span className="text-[#B5B5B5] font-medium text-[14px]">
              전체 310개
            </span>
            {/*추후 서버 연동 시 전체 상품 개수 받아와서 위 코드 수정 */}
            <Sort value={sort} onChange={setSort} />
          </div>
          <p className="text-[#B5B5B5] text-[14px] font-medium">
            상품을 클릭하면 해당 상품 사이트로 이동합니다.
          </p>
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
      </div>
    </>
  );
}

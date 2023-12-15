<h1>📔 단디</h1>

<img  src="https://cdn.discordapp.com/attachments/1170919342456700992/1176352843448451153/52d1f8d5a948a299.png?ex=656e8ef5&is=655c19f5&hm=7104f6e4ce7497f81ad8b8eb2e27bc1e24d2f743fc61c5068ea74803f911b5e0&"/>

> 다가오는 새해, 부푼 마음으로 다이어리를 고르고 있는 당신! 마음과는 다르게 갈수록 비어가는 다이어리가 고민이지 않았나요?
> 작심삼일은 그만! 단디와 함께 매일매일 꾸준히 하루를 기억해봐요 🌱

<br/>
<p align="center">
  <a href="https://dandi-ary.site" >🔗 지금 바로 단디 사용하기</a>
</p>
<br/>
<div align="center">
  <h3>📖 문서</h3> 
  <p>
    <a href="https://www.notion.so/kimyoonju/fbe671710cd9468587be6232d9697d3c?pvs=4">📘노션</a>
    &nbsp; | &nbsp; 
    <a href="https://www.figma.com/file/zJVmbuNXUV3cFFIFCqolXY/Dandi_Design?type=design&node-id=0-1&mode=design&t=nfkk1qWdfnKYXdta-0">🎨피그마</a>
    &nbsp; | &nbsp; 
    <a href="https://github.com/boostcampwm2023/web18_Dandi/wiki">✏️위키</a>
  </p>
</div>

<br/>
<h3>🚀 프로젝트 소개</h3>

<b>홈</b>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/7f97bc0a-2e12-4708-94c7-5a91d9a5b5bf" alt="홈"/>

<ul>
  <li>일기 작성 기록과 그날의 기분을 잔디로 확인하고, 사용자가 선택한 기간 내의 일기에 저장된 감정 정보를 확인할 수 있어요.</li>
  <li>친구 목록을 조회하거나 다른 사용자에게 친구 신청을 보내는 등 친구를 관리할 수 있어요.</li>
  <li>나 혹은 친구가 작성했던 모든 일기 목록을 보여드려요.</li>
</ul>

<b>피드</b>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/a7f19b08-c478-48df-b255-36b28d8a3e70" alt="피드"/>

<ul>
  <li>친구들이 쓴 일기를 최신 순으로 보여드려요.</li>
  <li>친구들의 일기에 이모지로 반응을 남기고, 각 일기마다 어떤 친구가 어떤 반응을 남겼는지 확인할 수 있어요.</li>
</ul>

<b>일기 작성</b>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/46df11b3-a9e9-4952-acc3-f4022ad985e2" alt="일기 작성"/>

<ul>
  <li>오늘의 일기를 작성할 수 있어요.</li>
  <li>오늘 하루를 요약하는 제목과 하루의 기억을 담은 이미지를 함께 저장하고, 오늘의 감정을 나타내는 이모지와 키워드로 더 풍부하게 하루를 기록하실 수 있어요.</li>
</ul>

<b>내 일기</b>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/87bcaaf5-625e-45f4-9183-67c7465e1bdb" alt="내 일기"/>

<ul>
  <li>내가 기록한 일기를 하루, 일주일, 한 달 단위로 볼 수 있어요.</li>
  <li>선택한 단위마다 가장 효과적인 방법으로 일기를 보실 수 있도록 준비했어요.</li>
  <li>이전에 쓴 일기 내용이 궁금할 때는 제목, 일기 내용이나 키워드로 검색해보세요.</li>
</ul>
<br/>

<h2>💻 기술적 도전</h2>

<h3>[FE] API 요청 최적화</h3>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/75190035/d0b591b5-fc70-4f7a-a6c0-ac86eb67e491" alt="API 요청 최적화 결과"/>

<li>불필요한 서버 요청 비용을 줄이기 위해서 API 요청 최적화에 대해 고민했고, 이후 유지보수에서 어려움을 겪지 않도록 어떤 방식으로 API 요청을 최적화해야하는지 고민했습니다.</li>
<li>저희 팀은 API 응답 데이터 수정해 요청을 최소화하고 디바운싱, Tanstack Query stale Time 3가지 키워드로 해당 문제에 접근했고 기존 요청들을 평균 66% 수준으로 감소시킬 수 있었습니다.</li>

<br/>

> - <a href="https://www.notion.so/kimyoonju/af665439840e4367b379c7a2d1b0125a?v=e112c574bbc74ee09e0ddf14a9893c2e&p=695d6520aa9142658e81b6bbd19c1d55&pm=s">디바운싱과 쓰로틀링</a>
> - <a href="https://velog.io/@dohun2/React-Query%EB%A1%9C-API-%EC%9A%94%EC%B2%AD-%EC%A4%84%EC%9D%B4%EA%B8%B0">TanStack Query(React Query) API 요청 줄이기</a>

<br/>

<h3>[BE] 무중단 배포</h3>

<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/75190035/d0ff1dc3-5a4a-44e9-bafc-0a5f80050172" alt=""/>

<li>서버 이전 과정에서 이전 서버와 동일하게 프로그램을 설치/세팅하는 과정에 번거로움을 느껴 도커를 도입했습니다. 도커 도입 후 배포 과정에서 불가피하게 5분의 다운 타임이 발생했는데 해당 문제 해결을 어떤 방식으로 배포를 진행해야하는지 고민했습니다.</li>
<li>해당 문제 해결을 위해서 블루-그린 방식으로 무중단 배포를 도입하기로 결정했고, 다운 타임을 5분 -> 1초 미만으로 줄일 수 있었습니다.</li>

<br/>

> 글 작성 예정

<br/>

<h3>[BE] 엘라스틱서치 적용기</h3>

<img width="788" alt="image" src="https://github.com/boostcampwm2023/web18_Dandi/assets/75190035/cb305f89-2609-4002-a33f-3c47cd85315d">

<li>저희 서비스의 목표 중 하나는 검색을 통해 사용자가 지난을 쉽게 돌아보게 하는 것입니다. 일기 검색을 위해 최대 10,000자의 일기 본문에 검색 기능을 적용해야했는데, MySQL만을 사용했을 때 Like문의 느린 조회 속도와 Full Text Index의 느린 삽입 속도를 우려해 다른 방식을 고민했습니다.</li>
<li>저희 팀은 역색인을 통한 빠른 검색을 지원하는 엘라스틱서치를 도입해 10초간 500명의 사용자가 검색을 사용하는 시나리오에서 요청 시간을 약 50% 수준으로 감소시킬 수 있었습니다.</li>

<br/>

> - <a href="https://www.notion.so/kimyoonju/2-Elasticsearch-Like-7bb08e2d93584255a95a9e075afdbfc0?pvs=4">검색 기능 개선기(2) - Elasticsearch에서 Like문 구현하기</a>
> - <a href="https://www.notion.so/kimyoonju/af665439840e4367b379c7a2d1b0125a?v=e112c574bbc74ee09e0ddf14a9893c2e&p=396733db362e4f20bdad9e03037f5da0&pm=s">검색 성능 개선기(3) - CDC를 못하면 redis로 라도…</a>

<br/>

<h3>📚 단디 개발 일지</h3>
<ul>
  <li>
    <a href="https://www.notion.so/kimyoonju/af665439840e4367b379c7a2d1b0125a?v=e112c574bbc74ee09e0ddf14a9893c2e&p=c247882f2f6846c883a417ef4681b3e2&pm=s">[Elasticsearch | 박효종]DB 데이터를 가져오는데 할게 왜이리 많죠?</a>
  </li>
  <li>
    <a href="https://velog.io/@shunny/Web-%EC%95%8C%EA%B3%A0-%EB%B3%B4%EB%A9%B4-%EC%A2%8B%EC%9D%80-%EB%86%88...-CORS">[CORS | 최수현]알고보면 좋은 놈 CORS</a>
  </li>
  <li>
    <a href="https://velog.io/@gimewn/useRef-%EC%99%9C-%EC%93%B0%EB%8A%94-%EA%B1%B4%EA%B0%80%EC%9A%94">[React Portal | 김윤주] 리액트로 닥터스트레인지가 되는 법</a>
  </li>
  <li>
    <a href="https://velog.io/@gimewn/useRef-%EC%99%9C-%EC%93%B0%EB%8A%94-%EA%B1%B4%EA%B0%80%EC%9A%94">[Emotion & Tailwind CSS | 이도훈] Emotion과 Tailwind CSS</a>
  </li>
  <li>
    <a href="https://surpise.tistory.com/6">[Query Invalidation | 서종현] 이건 무효야! Query Invalidation</a>
  </li>
</ul>

<br/>
<h3>⚙️ 프로젝트 구조</h3>
<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/75190035/fad709f3-3599-4dcc-83ad-51566a65e969" alt="테크 스택"/>
<br/>

<h3>🚀 인프라 구조</h3>
<img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/ed822c7f-7511-4604-9d95-f4ff2568e01b" alt="인프라 구조"/>
<br/>

<h2>👨‍👨‍👧‍👧 팀원</h2>

| <img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/2968ee75-3357-4378-ab32-202ad12bc76f" height=150 width=150 /> | <img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/0d3085f3-c588-4b21-98b1-bf6829793e0b" height=150 width=150 /> | <img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/4bd0fd8a-c94f-4175-9c1e-d75a73be5858" height=150 width=150 /> | <img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/06cb3533-d927-4ed1-bd8b-cddffe298e3f" height=150 width=150 /> | <img src="https://github.com/boostcampwm2023/web18_Dandi/assets/86141652/7b8fde40-bc13-4cf2-81ea-d538d69cdf82" height=150 width=150 /> |
| :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                   BE                                                                   |                                                                   BE                                                                   |                                                                   FE                                                                   |                                                                   FE                                                                   |                                                                   FE                                                                   |
|                                                [박효종](https://github.com/HyoJongPark)                                                |                                                 [최수현](https://github.com/shunny822)                                                 |                                                  [김윤주](https://github.com/gimewn)                                                   |                                                  [서종현](https://github.com/surpise)                                                  |                                                  [이도훈](https://github.com/dohun2)                                                   |

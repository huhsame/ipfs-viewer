# IPFS-VIEWER

그림설명 넣을거야 

# Getting Started 

node.js 서버와 리액트 클라이언트로 구성
외부 디비와 ipfs와 연동

## 실행준비

### IPFS
본 pc에 ipfs daemon이 실행 중이어야 함
`App.js`에서 ipfs연결하는 부분 주석처리하고 Ipfs 부분 빼고 테스트실행 가능

### DB
연결할 디비의 정보를 .env 파일에 설정

## 실행순서


### `npm install`

클라이언트, 서버에 필요한 패키지들 모두 하나의 package.json 파일에 있음

### `node server/server.js`

서버 실행 전, DB_MODE 확인 필요: .env 참고

### `npm start`
 [http://localhost:3000](http://localhost:3000) 에서 확인
 


## 상세설명

클라이언트가 전달한 conditions(timestamp)를 이용하여 서버가 디비에서 원하는 cid를 얻은 뒤 ipfs로 cid에 해당하는 파일을 다운로드받아 클라이언트가 접근할 수 있도록 데이터나 파일경로를 전달한다.
현재 처리할 수 있는 데이터 종류: pi-cam video, CSI signal csv

### client
`App.js`가 실행되면 ipfs-http-client가 실행중인 ipfs instance와 연결.
useEffect()의 두번째 변수에 `[ipfs]`를 지정하여, ipfs 값이 변경될 때마다 effect 재실행
뷰만 테스트할 때는 ipfs에 해당하는 부분 모두 주석처리. (여러 곳에 걸쳐있으므로 주의)

3파트로 구성
- Search View: 검색 조건 입력. 시작시간이 입력되면 끝시간은 duration 만큼 증가한 시간으로 자동으로 설정됨
- Player: react-player 로 영상 플레이
- Chart: d3.js로 CSI 데이터 시각화 (Line chart, tooltip)
chart에서 원하는 지점 클릭 시 Player에서 해당 시간으로 이동
*추후 sound파트 추가, labeling 파트 추가 될 수 있음*
 
 현재 차트가 넓이가 고정이기 때문에 모바일에서 실행시 보기 불편할 수 있음
 
 ### server
 디비에 타임스탬프가 Date와 Time으로 나누어 저장되어있기 때문에 통합하면 좋겠다.
 `server.js`에서 쿼리 수행하고 결과를 이용하여 `ipfs-sh.js`가 파일을 다운로드 받음
 downloadFileByHashes() 함수에서 shell을 실행시켜 ipfs get 명령어를 수행
 여러개의 ipfs 명령어를 실행할때에는 `&&` 연결 (되어있음)
 shell에서 명령어가 모두 수행되었는지 `stdout`에서 콜백함수로 확인할 수있음. (그러나 불러와야할 ipfs파일이 많은경우 시간이 많이 소요되고 제대로 동작을 안하는것같다. 작업 마쳤다고 메세지 뱉었는데, 다운로드되었어야 할 파일이 없는경우 존재)
 
`setFileName`함수는 ipfs에서 받아온 파일의 이름을 원래 파일이름으로 변경한다. (다운받을때는 cid가 파일 이름이며 어떠한 확장자도 지정되지않는다.)
 `concatVideos`함수에서 ffmpeg을 이용하여 동영상 하나로 합친 후 `/public`에 저장 (클라이언트에게 경로 전달)
`getCSIfromCSV`함수에서 ipfs에서 다운로드받은 csv 파일을 열어 data 추출 (d3.js에서 사용 가능하도록 구조 변형 필요). length는 받아올 column의 수로 기본은 51이지만 (subcarrier 수) 라인차트를 한개만 그리기 위해서 2라고 설정해둠

쿼리 -> 파일 다운로드 -> 데이터 가공 -> 전달
과정이 모두 실행해야하지만 테스트를 위해 중간중간 과정생략한 코드들이 있으니 무시하되 지우지는 말것.


# 



 
 
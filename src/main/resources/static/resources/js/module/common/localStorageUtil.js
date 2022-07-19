/**********************************************************************************************
 * @FileName  : localStorageUtil.js
 * @Date      : 2018-05-16
 * @작성자      : 김성훈
 * @설명       : 로컬스토리지 값을 제어하는 유틸 클래스
 **********************************************************************************************/

export class LocalStorageUtil {

    /**********************************************************************************************
     * @Method 설명 : 최근본매물(visitStorage), 관심매물(interestStorage) 로컬스토리지 제어
     *                  interestStorage의경우 들어온 bangNo가 존재하면 제거함
     *                  스토리지는 최대 100개 제한걸린 큐 형태로 관리함
     * @작성일   : 2018-05-16
     * @작성자   : 김성훈
     * @변경이력  : 2019-05-13 최근본분양(visitParcelOutStorage), 최근본단진(visitEstateStorage) 추가
     **********************************************************************************************/
    addOrDelHistory(storageName, obj, dontPush) {
        const limit = 100;
        let storageItem = JSON.parse(localStorage.getItem(storageName)) || [];

        // 제거대상을 찾고
        let removeTarget = this.findItem({
            storageName,
            no: obj.no
        });

        //최근 연락한 매물 처리
        if(storageName === "calledHistoryJobKey"){
            if(obj.remove === true){
                _.remove(storageItem, (item) => {
                    return String(item.no) === String(obj.no) && String(item.time) === String(obj.time) && String(item.slct) === String(obj.slct);
                });
            }else{
                let matchObj = this.findCalledHistoryItem({storageName: storageName, obj: obj});
                if(_.isEmpty(matchObj)){
                    storageItem.push(obj);
                }else{
                    _.remove(storageItem, (item) => {
                        return item.no === matchObj.no && String(item.time).substring(0, 10) === String(obj.time).substring(0,10) && String(item.slct) === String(obj.slct);
                    });
                    storageItem.push(obj);
                }
            }
        }else{
            // 스토리지에서 제거대상을 없앰.
            _.remove(storageItem, (item) => {
                return item.no === removeTarget.no;
            });
        }

        // 삭제대상 없었거나 최근본매물/최근본분양/최근본단지는 항상 새거 넣어줌 (= 관심매물은 제거만 함)
        if((_.isEmpty(removeTarget) && !dontPush) && storageName !== "calledHistoryJobKey") {
            storageItem.push(obj);
        }

        // 최대 100개까지만 보유하는 큐 구현
        if(storageItem.length > limit) {
            storageItem = _.tail(storageItem);
        }

        // 최종결과 저장
        localStorage.setItem(storageName, JSON.stringify(storageItem));

        if(storageName === "calledHistoryJobKey") {
            let totalStorage = JSON.parse(localStorage.getItem("calledHistoryJobKey"));
            if (totalStorage.length == 0) {
                localStorage.removeItem("calledHistoryJobKey");
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : jobNo객체 찾기
     * @작성일   : 2018-06-15 
     * @작성자   : 김성훈
     * @변경이력  : 2019-05-23 둘다 String으로 변환 후 비교하도록 변경(조문기)
     **********************************************************************************************/
    findItem ({storageName, no}) {
        let storageItem = localStorage.getItem(storageName) ? JSON.parse(localStorage.getItem(storageName)) : [];
        // 제거대상을 찾고
        let result = {};
        storageItem.forEach(function (item) {
            if (String(item.no) === String(no)) {   // no가 같으면 일단 제거 대상
                result = item;
                return false;           // 그만 돌고
            }
        });

        return result;
    }

    /**********************************************************************************************
     * @Method 설명 : 연락한 매물에서만 쓰일 no와 날짜를 같이 비교해서 찾아주는 것
     * @작성일   : 2018-06-27
     * @작성자   : 조문기
     * @변경이력  :
     **********************************************************************************************/
    findCalledHistoryItem ({storageName, obj}) {
        let storageItem = localStorage.getItem(storageName) ? JSON.parse(localStorage.getItem(storageName)) : [];
        // 제거대상을 찾고
        let result = {};
        storageItem.forEach(function (item) {
            if (String(item.no) === String(obj.no) && String(item.time).substring(0, 10) === String(obj.time).substring(0,10)) {   // no가 같으면 일단 제거 대상
                result = item;
                return false;           // 그만 돌고
            }
        });
        return result;
    }

    /**********************************************************************************************
     * @Method 설명 : 최근본매물(visitStorage), 관심매물(interestStorage) 로컬스토리지 모든 값들을 JSON Object로 반환 (없는 스토리지는 빈배열)
     *           예>    {
     *                      visitStorage : [{},{},{}],
     *                      interestStorage : [{},{},{}]
     *                  }
     * @작성일   : 2018-06-20
     * @작성자   : 김성훈
     * @변경이력  : 2019-05-13 최근본분양/최근본단지 추가
     **********************************************************************************************/
    get itemInJSON() {
        return {
            calledHistoryJobKey : localStorage.getItem("calledHistoryJobKey") ? JSON.parse(localStorage.getItem("calledHistoryJobKey")) : []
        }
    }

    /**********************************************************************************************
     * @Method 설명 : 스토리지 비움. (이상한이름이나 이름지정 안하면 다 지움)
     * @작성일   : 2018-06-20 
     * @작성자   : 김성훈
     * @변경이력  : 2019-05-13 최근본분양/최근본단지 추가
     **********************************************************************************************/
    emptyStorage(storageName) {
        if(storageName === "calledHistoryJobKey"){
            localStorage.removeItem(storageName);
        } else {
            localStorage.removeItem("calledHistoryJobKey");
        }
    }
}
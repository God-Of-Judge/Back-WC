import bridgeResponse from "./bridgeResponse";
import bridgeRequest from "./bridgeRequest";
import bridgeWebResolver from "./bridgeWebRequest";
import IBridge from "./IBridge";

/**********************************************************************************************
 * @FileName  : bridgeFactory.js
 * @Date      : 2018. 6. 2.
 * @작성자      : 신희원
 * @설명       : 브리지 웹 & 앱 구분 처리
 **********************************************************************************************/
class BridgeFactory extends IBridge{

	constructor() {
		require("./bridgeAgent");
		require("./bridgeBroadCast");
		super();
		return this.bridgeFilter();
	}

	bridgeFilter() {
		if (bridgeAgent.isApp()) {

			this.response = new bridgeResponse();
			this.request = new bridgeRequest();
			this.response.onResponseWait();
			this.request.setBridge();
			this.request.bridgeInit();
			return this.request;
		}else{
			return new bridgeWebResolver();
		}
	}
}
window.bridge = new BridgeFactory();


package com.smart.project.component.data;

import lombok.Data;

/**********************************************************************************************
 * @FileName  : LocCodeObject.java
 * @Date      :  2019-02-01
 * @작성자      : 김성훈
 * @설명       : 지역 코드값 객체
 **********************************************************************************************/
@Data
public class LocCodeObject {

	private Code regLoc = new Code();
	private Code regLcode = new Code();
	private Code regLdetail = new Code();

	public LocCodeObject(String lCode, String lCodeName, String mCode, String mCodeName, String sCode, String sCodeName) {
		this.regLoc.setCode(lCode);
		this.regLoc.setCodeName(lCodeName);

		this.regLcode.setCode(mCode);
		this.regLcode.setCodeName(mCodeName);

		this.regLdetail.setCode(sCode);
		this.regLdetail.setCodeName(sCodeName);
	}

	@Data
	public class Code {
		String code;
		String codeName;
	}

}


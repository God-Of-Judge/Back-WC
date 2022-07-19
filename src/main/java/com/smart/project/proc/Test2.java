package com.smart.project.proc;

import com.smart.project.annotation.Master;
import com.smart.project.annotation.Master2;
import com.smart.project.common.vo.MenuVO;
import org.springframework.stereotype.Component;

import java.util.List;

@Master2
@Component
public interface Test2 {
	/**********************************************************************************************
	 * @Method 설명 : Test_Mapper.xml에 있는 쿼리를 사용 할 경우
	 * @작성일 : 2021-02-15
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	List<MenuVO> sqlMenu2(int memNo);

	List<MenuVO> sqlMenu3(int memNo);
	List<MenuVO> sqlMenu4(int memNo);
	List<MenuVO> sqlMenu5(int memNo);
	List<MenuVO> sqlMenu6(int memNo);
}

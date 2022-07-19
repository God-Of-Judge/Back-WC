package com.smart.project.proc;

import org.apache.ibatis.jdbc.SQL;

public class SqlTest {
    public String sqlMenu(int memNo){
        return new SQL()
                .SELECT("a.menu_no, a.parent_no, b.menu_nm, a.ord_no, b.use_yn, trim(b.link_url) as link_url, a.depth_no")
                .FROM("i_hr.adm_usr_menu a, i_hr.adm_menu b")
                .WHERE("a.emp_no=" + String.valueOf(memNo) + " AND a.menu_no=b.menu_no AND b.use_yn='y'")
                .toString();
    }


}

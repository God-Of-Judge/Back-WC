package com.smart.project.common.vo;

import lombok.Data;

import java.util.List;

@Data
public class MenuVO implements Comparable<MenuVO> {
    private int menuNo;
    private int parentNo;
    private String menuNm;
    private int ordNo;
    private String useYn;
    private String linkUrl;
    private int depthNo;
    private boolean bChild = false;
    private List<MenuVO> childMenu;

    @Override
    public int compareTo(MenuVO m){
        if (this.ordNo < m.getOrdNo()) {
            return -1;
        } else if (this.ordNo > m.getOrdNo()) {
            return 1;
        }
        return 0;
    }
}

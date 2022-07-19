package com.smart.project.component.data;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class CodeObject implements Serializable {
	private String description;
	private String id;
	private List<Code> codeList = new ArrayList<>();

	@Data
	public class Code {

		private String code = "";
		private String codeName = "";
		private String pKey = "";
		private String url = "";
		private String active = "";
		private String calendarKind = "";
		public String getCode() {
			return code == null ? "" : code;
		}
		private String auth ="";
		private boolean checked = false;
	}
}

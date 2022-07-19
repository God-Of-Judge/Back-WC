package com.smart.project.component;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@Slf4j
@Component
public class VersionComponent {
	@Value("${spring.profiles.active}") private String spring_profiles_active;

	@Value("${inforex.root.directory}") private String inforex_root_directory;
	
	private VersionData makeVersionData (String versionFileFullPath) throws IOException {
		VersionData result = new VersionData();
		try (FileReader fileReader = new FileReader(versionFileFullPath);
			 BufferedReader bufReader = new BufferedReader(fileReader)) {
			String line;
			while((line = bufReader.readLine()) != null){
				if(StringUtils.isNotEmpty(line)){
					result.strVersion = line;
					result.versionChk = true;
				}
			}
		}
		return result;
	}

	public String getVersion(String resourcesFile){
		String sVersion = "";
		try{
			if(!this.spring_profiles_active.equals("local")){
				VersionData vData = this.makeVersionData(inforex_root_directory + "/build/_ver.txt");
				if(vData.getVersionChk()) sVersion = "0." + StringUtils.leftPad(vData.strVersion, 4, "0");
				else sVersion = String.valueOf(System.currentTimeMillis());
			}else{
				sVersion = String.valueOf(System.currentTimeMillis());
			}

		}catch (Exception e){
			log.error("{}", e);
		}
		return !sVersion.equals("") ? resourcesFile + "?ver=" + sVersion : resourcesFile;
	}

	class VersionData {
		private String strVersion = "";
		private boolean versionChk = false;
		VersionData() {}
		String getStrVersion() {
			return this.strVersion;
		}
		boolean getVersionChk() {
			return this.versionChk;
		}
	}
}

package com.smart.project.web.home.vo;

import lombok.*;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
public class JoinVO {
    @NonNull
    String id;
    @NonNull
    String email;
    @NonNull
    String pw;
    String nick;
    String gender;
    String birth;
    String locWantKey;
    String wantLoc;
}

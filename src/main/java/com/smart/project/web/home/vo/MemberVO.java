package com.smart.project.web.home.vo;

import lombok.*;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
public class MemberVO {
    @NonNull
    String mbId;
    @NonNull
    String mbPw;
    String mbPhone;
    String mbNick;
    String admin;
}

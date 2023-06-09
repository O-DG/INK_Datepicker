# INK_Datepicker

Datepicker를 사용하기 위해 생각보다 많은 과정을 거쳐야 한다는 것을 느끼고,
이를 최소화하는 것을 목표로 작성되었습니다.

또한, 반응형에 다소 취약함을 느끼고 보완하기로 했습니다.

jquery ui를 통한 datepicker 사용을 위한 코드로서 생각보다 많은 것을 해야한다는 것을 알 수 있습니다.

```sh
    // jquery ui css
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    // jquery style css
    <link rel="stylesheet" href="/resources/demos/style.css">
 
    // jquery js
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
 
    // jquery ui js
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    // jquery datepicker html
    <input type="text" id="datepicker">

    // jquery datepicker script
    <script>
        // 한국어(다른언어)를 사용하고 싶다면 추가적인 코드 작성이 필요합니다. write more if want korean language
        $.datepicker.setDefaults({
            dateFormat: 'yy-mm-dd',
            prevText: '이전 달',
            nextText: '다음 달',
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            yearSuffix: '년'
        });

        $( function() {
            $( "#datepicker" ).datepicker();
        } );
    </script>
```

반면, ink_datepicker는?

```sh
    // ink_datepicker css
    <link rel="stylesheet" href="//ink.pe.kr/datepicker/style.css">
    
    // ink_datepicker js
    <link rel="stylesheet" href="//ink.pe.kr/datepicker/ink_datepicker.js">

    // ink_datepicker html
    <input type="text" name="date_1" value="" i-datepicker>
```

link 이후 마크업 단계에서 모든 것을 해결할 수 있습니다.


<div align="center">
	<img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=white" />
	<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white" />
</div>

## 목차

- [프로젝트 설명](#프로젝트-설명)
- [사용법](#사용법)
- [라이선스](#라이선스)

## 프로젝트 설명

프로젝트에 대한 자세한 개요를 제공합니다. 목적, 기능 및 사용자 또는 기여자가 알아야 할 관련 정보를 설명합니다. 화면 캡처 또는 다이어그램을 추가하여 이해를 돕는 것도 좋습니다.

## 사용법

사용법은 간단합니다.
link 코드와 함께 input 태그에 i-datepicker 라는 속성만 추가 입력하는 것으로 적용됩니다.

```sh
    // ink_datepicker css
    <link rel="stylesheet" href="//ink.pe.kr/datepicker/style.css">
    
    // ink_datepicker js
    <link rel="stylesheet" href="//ink.pe.kr/datepicker/ink_datepicker.js">

    // ink_datepicker html
    <input type="text" name="date_1" value="" i-datepicker>
```

## 라이선스
모두가 원하는대로 무엇이든 할 수 있습니다.
다만, 출처만 남겨주세요.

Everyone can do whatever they want.
However, please leave only the source.


- **변경 내역** :
2023-06-00 : 

- **크레딧** : INK - ODG

- **FAQ** : lubiallu@naver.com
